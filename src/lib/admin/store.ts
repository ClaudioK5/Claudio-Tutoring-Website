import "server-only";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import {
  clampLessons,
  getPackage,
  isPackageId,
  isSourceId,
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
  package_id: string;
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
    packageId: isPackageId(row.package_id) ? row.package_id : "single",
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

  async function ready() {
    if (!schemaReady) {
      schemaReady = sql`
        CREATE TABLE IF NOT EXISTS students (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          subject TEXT NOT NULL,
          package_id TEXT NOT NULL,
          total_lessons INTEGER NOT NULL,
          package_value_cents INTEGER NOT NULL,
          lessons_completed INTEGER NOT NULL DEFAULT 0,
          source TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `
        .then(() => undefined)
        .catch((err) => {
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
      const pkg = getPackage(input.packageId);
      const rows = (await sql`
        INSERT INTO students (id, name, subject, package_id, total_lessons, package_value_cents, source)
        VALUES (${randomUUID()}, ${input.name}, ${input.subject}, ${pkg.id}, ${pkg.hours}, ${pkg.value * 100}, ${input.source})
        RETURNING *
      `) as StudentRow[];
      return rowToStudent(rows[0]);
    },

    async update(id, input) {
      await ready();
      const pkg = getPackage(input.packageId);
      // Same package keeps its original value; a new package takes the current price.
      const rows = (await sql`
        UPDATE students SET
          name = ${input.name},
          subject = ${input.subject},
          source = ${input.source},
          total_lessons = CASE WHEN package_id = ${pkg.id} THEN total_lessons ELSE ${pkg.hours} END,
          package_value_cents = CASE WHEN package_id = ${pkg.id} THEN package_value_cents ELSE ${pkg.value * 100} END,
          lessons_completed = LEAST(
            lessons_completed,
            CASE WHEN package_id = ${pkg.id} THEN total_lessons ELSE ${pkg.hours} END
          ),
          package_id = ${pkg.id},
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

async function readFile(): Promise<Student[]> {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, "utf8")) as Student[];
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
      const pkg = getPackage(input.packageId);
      const student: Student = {
        id: randomUUID(),
        name: input.name,
        subject: input.subject,
        packageId: pkg.id,
        totalLessons: pkg.hours,
        packageValue: pkg.value,
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
      const samePackage = current.packageId === input.packageId;
      const pkg = getPackage(input.packageId);
      const totalLessons = samePackage ? current.totalLessons : pkg.hours;
      const updated: Student = {
        ...current,
        name: input.name,
        subject: input.subject,
        source: input.source,
        packageId: pkg.id,
        totalLessons,
        packageValue: samePackage ? current.packageValue : pkg.value,
        lessonsCompleted: Math.min(current.lessonsCompleted, totalLessons),
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
