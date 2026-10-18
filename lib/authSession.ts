import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Core utility to fetch the user session on the server.
 * Leverages Better Auth's cookieCache to bypass MongoDB lookups.
 */
export async function getServerSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

/**
 * Use inside Pages and Layouts.
 * Automatically kicks unauthenticated users to /login using Next.js redirect().
 */
export async function requireServerSessionOrRedirect(redirectTo = "/login") {
  const session = await getServerSession();

  if (!session) {
    redirect(redirectTo);
  }

  return session;
}

/**
 * Use inside Server Actions and API Route Handlers.
 * Throws a standard Error if unauthorized, making it safe for try/catch blocks.
 */
export async function requireServerSessionOrThrow() {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}