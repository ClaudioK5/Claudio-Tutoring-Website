import { redirect } from "next/navigation";
import { Dashboard } from "@/components/admin/Dashboard";
import { isAuthenticated } from "@/lib/admin/session";
import { getStorageMode, getStore } from "@/lib/admin/store";
import type { Student } from "@/lib/admin/students";

export default async function AdminPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const storageMode = getStorageMode();
  let students: Student[] = [];
  let loadError: string | null = null;

  if (storageMode !== "none") {
    try {
      students = await getStore().list();
    } catch (err) {
      console.error("[admin] failed to load students", err);
      loadError = "Couldn't load students from the database. Check the connection and refresh.";
    }
  }

  return <Dashboard initialStudents={students} storageMode={storageMode} loadError={loadError} />;
}
