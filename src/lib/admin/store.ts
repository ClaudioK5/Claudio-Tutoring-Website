import "server-only";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import {
  clampLessons,
  emptyItems,
  isPackageId,
  isSourceId,
  summarizeItems,
  type ItemCounts,
  type Student,
  type StudentInput,
} from "./students";

export type StorageMode = "neon" | "file" | "none";

/** The local JSON file only works in development: Vercel's filesystem is not persistent. */
export function getStorageMode(): StorageMode {
  if (process.env.DATABASE_URL) return "neon";
  if (process.env.NODE_ENV !== "production") return "file";
  return "none";
}

export class StorageUnavailableError extends Error {
  constructor() {
    super("Database not connected");
  }
}

interface StudentStore {
  list(): Promise<Student[]>;
  create(input: StudentInput): Promise<Student>;
  update(id: string, input: StudentInput): Promise<Student | null>;
  remove(id: string): Promise<boolean>;
  adjustLessons(id: string, delta: number): Promise<Student | null>;
}

/* ----------------------------- Neon (Postgres) ---------------------------- */

type StudentRow = {
  id: string;
  name: string;
  subject: string;
  single_count: number;
  pack5_count: number;
  pack10_count: number;
  total_lessons: number;
  package_value_cents: number;
  lessons_completed: number;
  source: string | null;
  created_at: string | Date;
};

function rowToStudent(row: StudentRow): Student {
  return {
    id: row.id,
    name: row.name,
    subject: row.subject,
    items: {
      single: Number(row.single_count),
      "pack-5": Number(row.pack5_count),
      "pack-10": Number(row.pack10_count),
    },
    totalLessons: Number(row.total_lessons),
    packageValue: Number(row.package_value_cents) / 100,
    lessonsCompleted: Number(row.lessons_completed),
    source: isSourceId(row.source) ? row.source : null,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

let schemaReady: Promise<void> | null = null;

function neonStore(url: string): StudentStore {
  const sql = neon(url);

  async function migrate() {
    await sql`
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        subject TEXT NOT NULL,
        package_id TEXT,
        single_count INTEGER NOT NULL DEFAULT 0,
        pack5_count INTEGER NOT NULL DEFAULT 0,
        pack10_count INTEGER NOT NULL DEFAULT 0,
        total_lessons INTEGER NOT NULL,
        package_value_cents INTEGER NOT NULL,
        lessons_completed INTEGER NOT NULL DEFAULT 0,
        source TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
    // Tables created before quantities existed: add the counters and convert the old single package.
    await sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS single_count INTEGER NOT NULL DEFAULT 0`;
    await sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS pack5_count INTEGER NOT NULL DEFAULT 0`;
    await sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS pack10_count INTEGER NOT NULL DEFAULT 0`;
    await sql`ALTER TABLE students ALTER COLUMN package_id DROP NOT NULL`;
    await sql`
      UPDATE students SET
        single_count = CASE WHEN package_id = 'single' THEN 1 ELSE 0 END,
        pack5_count = CASE WHEN package_id = 'pack-5' THEN 1 ELSE 0 END,
        pack10_count = CASE WHEN package_id = 'pack-10' THEN 1 ELSE 0 END,
        package_id = NULL
      WHERE package_id IS NOT NULL
    `;
  }

  function ready() {
    if (!schemaReady) {
      schemaReady = migrate().catch((err) => {
        schemaReady = null;
        throw err;
      });
    }
    return schemaReady;
  }

  return {
    async list() {
      await ready();
      const rows = (await sql`SELECT * FROM students ORDER BY created_at ASC`) as StudentRow[];
      return rows.map(rowToStudent);
    },

    async create(input) {
      await ready();
      const { lessons, value } = summarizeItems(input.items);
      const rows = (await sql`
        INSERT INTO students (
          id, name, subject, single_count, pack5_count, pack10_count,
          total_lessons, package_value_cents, source
        )
        VALUES (
          ${randomUUID()}, ${input.name}, ${input.subject},
          ${input.items.single}, ${input.items["pack-5"]}, ${input.items["pack-10"]},
          ${lessons}, ${Math.round(value * 100)}, ${input.source}
        )
        RETURNING *
      `) as StudentRow[];
      return rowToStudent(rows[0]);
    },

    async update(id, input) {
      await ready();
      const { lessons, value } = summarizeItems(input.items);
      const rows = (await sql`
        UPDATE students SET
          name = ${input.name},
          subject = ${input.subject},
          source = ${input.source},
          single_count = ${input.items.single},
          pack5_count = ${input.items["pack-5"]},
          pack10_count = ${input.items["pack-10"]},
          total_lessons = ${lessons},
          package_value_cents = ${Math.round(value * 100)},
          lessons_completed = LEAST(lessons_completed, ${lessons}),
          updated_at = now()
        WHERE id = ${id}
        RETURNING *
      `) as StudentRow[];
      return rows[0] ? rowToStudent(rows[0]) : null;
    },

    async remove(id) {
      await ready();
      const rows = (await sql`DELETE FROM students WHERE id = ${id} RETURNING id`) as { id: string }[];
      return rows.length > 0;
    },

    async adjustLessons(id, delta) {
      await ready();
      const rows = (await sql`
        UPDATE students SET
          lessons_completed = LEAST(GREATEST(lessons_completed + ${delta}, 0), total_lessons),
          updated_at = now()
        WHERE id = ${id}
        RETURNING *
      `) as StudentRow[];
      return rows[0] ? rowToStudent(rows[0]) : null;
    },
  };
}

/* ------------------------- Local JSON file (dev only) ------------------------ */

const DATA_FILE = path.join(process.cwd(), ".data", "students.json");
let fileQueue: Promise<unknown> = Promise.resolve();

type StoredStudent = Omit<Student, "items"> & { items?: ItemCounts; packageId?: string };

/** Records saved before quantities existed have a single `packageId` instead of `items`. */
function normalize(record: StoredStudent): Student {
  const { packageId, items, ...rest } = record;
  if (items) return { ...rest, items };
  const converted = emptyItems();
  if (isPackageId(packageId)) converted[packageId] = 1;
  return { ...rest, items: converted };
}

async function readFile(): Promise<Student[]> {
  try {
    const raw = JSON.parse(await fs.readFile(DATA_FILE, "utf8")) as StoredStudent[];
    return raw.map(normalize);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeFile(students: Student[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(students, null, 2), "utf8");
}

/** Serializes read-modify-write cycles so quick +/- clicks don't overwrite each other. */
function withFile<T>(fn: (students: Student[]) => Promise<T> | T): Promise<T> {
  const run = fileQueue.then(async () => fn(await readFile()));
  fileQueue = run.catch(() => undefined);
  return run;
}

const fileStore: StudentStore = {
  list: () => withFile((students) => students),

  create: (input) =>
    withFile(async (students) => {
      const { lessons, value } = summarizeItems(input.items);
      const student: Student = {
        id: randomUUID(),
        name: input.name,
        subject: input.subject,
        items: input.items,
        totalLessons: lessons,
        packageValue: value,
        lessonsCompleted: 0,
        source: input.source,
        createdAt: new Date().toISOString(),
      };
      await writeFile([...students, student]);
      return student;
    }),

  update: (id, input) =>
    withFile(async (students) => {
      const current = students.find((s) => s.id === id);
      if (!current) return null;
      const { lessons, value } = summarizeItems(input.items);
      const updated: Student = {
        ...current,
        name: input.name,
        subject: input.subject,
        source: input.source,
        items: input.items,
        totalLessons: lessons,
        packageValue: value,
        lessonsCompleted: Math.min(current.lessonsCompleted, lessons),
      };
      await writeFile(students.map((s) => (s.id === id ? updated : s)));
      return updated;
    }),

  remove: (id) =>
    withFile(async (students) => {
      const next = students.filter((s) => s.id !== id);
      if (next.length === students.length) return false;
      await writeFile(next);
      return true;
    }),

  adjustLessons: (id, delta) =>
    withFile(async (students) => {
      const current = students.find((s) => s.id === id);
      if (!current) return null;
      const updated = {
        ...current,
        lessonsCompleted: clampLessons(current.lessonsCompleted + delta, current.totalLessons),
      };
      await writeFile(students.map((s) => (s.id === id ? updated : s)));
      return updated;
    }),
};

export function getStore(): StudentStore {
  const mode = getStorageMode();
  if (mode === "neon") return neonStore(process.env.DATABASE_URL!);
  if (mode === "file") return fileStore;
  throw new StorageUnavailableError();
}
