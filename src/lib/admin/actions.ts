"use server";

import { redirect } from "next/navigation";
import { verifyPin } from "./pin";
import { createSession, deleteSession, isAuthConfigured, isAuthenticated } from "./session";
import { getStore, StorageUnavailableError } from "./store";
import { isPackageId, isSourceId, type Student, type StudentInput } from "./students";

export type LoginState = { error?: string } | undefined;

export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

const FAILED_LOGIN_DELAY_MS = 1000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAuthConfigured()) {
    return { error: "Login is not configured on the server yet." };
  }

  const pin = String(formData.get("pin") ?? "");
  const valid = pin.length > 0 && pin.length <= 128 && (await verifyPin(pin));
  if (!valid) {
    await sleep(FAILED_LOGIN_DELAY_MS);
    return { error: "Incorrect PIN. Try again." };
  }

  await createSession();
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

/* -------------------------------- Students -------------------------------- */

const UNAUTHORIZED: ActionResult<never> = {
  ok: false,
  error: "Your session has expired. Please log in again.",
};

function parseInput(raw: unknown): StudentInput | string {
  if (!raw || typeof raw !== "object") return "Invalid data.";
  const data = raw as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const subject = typeof data.subject === "string" ? data.subject.trim() : "";

  if (!name) return "Name is required.";
  if (name.length > 80) return "Name is too long.";
  if (!subject) return "Subject is required.";
  if (subject.length > 80) return "Subject is too long.";
  if (!isPackageId(data.packageId)) return "Choose a package type.";
  if (data.source != null && data.source !== "" && !isSourceId(data.source)) {
    return "Invalid acquisition source.";
  }

  return {
    name,
    subject,
    packageId: data.packageId,
    source: isSourceId(data.source) ? data.source : null,
  };
}

async function guarded<T>(fn: () => Promise<ActionResult<T>>): Promise<ActionResult<T>> {
  if (!(await isAuthenticated())) return UNAUTHORIZED;
  try {
    return await fn();
  } catch (err) {
    if (err instanceof StorageUnavailableError) {
      return { ok: false, error: "Database not connected." };
    }
    console.error("[admin]", err);
    return { ok: false, error: "Something went wrong while saving. Please try again." };
  }
}

export async function createStudentAction(raw: StudentInput): Promise<ActionResult<Student>> {
  return guarded(async () => {
    const input = parseInput(raw);
    if (typeof input === "string") return { ok: false, error: input };
    return { ok: true, data: await getStore().create(input) };
  });
}

export async function updateStudentAction(
  id: string,
  raw: StudentInput,
): Promise<ActionResult<Student>> {
  return guarded(async () => {
    const input = parseInput(raw);
    if (typeof input === "string") return { ok: false, error: input };
    const student = await getStore().update(String(id), input);
    return student ? { ok: true, data: student } : { ok: false, error: "Student not found." };
  });
}

export async function deleteStudentAction(id: string): Promise<ActionResult<string>> {
  return guarded(async () => {
    const removed = await getStore().remove(String(id));
    return removed ? { ok: true, data: id } : { ok: false, error: "Student not found." };
  });
}

export async function adjustLessonsAction(
  id: string,
  delta: number,
): Promise<ActionResult<Student>> {
  return guarded(async () => {
    if (delta !== 1 && delta !== -1) return { ok: false, error: "Invalid change." };
    const student = await getStore().adjustLessons(String(id), delta);
    return student ? { ok: true, data: student } : { ok: false, error: "Student not found." };
  });
}
