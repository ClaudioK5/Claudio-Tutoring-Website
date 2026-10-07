import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAuthConfigured, isAuthenticated } from "@/lib/admin/session";

export default async function AdminLoginPage() {
  if (isAuthConfigured() && (await isAuthenticated())) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <LoginForm configured={isAuthConfigured()} />
    </main>
  );
}
