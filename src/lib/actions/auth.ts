"use server";

import { createSession, decrypt, deleteSession } from "@/lib/session";
import { getUserByEmail } from "@/lib/repositories/user.repository";
import { cookies } from "next/headers";

export async function signIn(email: string) {
  try {
    const user = await getUserByEmail(email);
    await createSession(user.id);
  } catch (error: any) {
    console.error(error);
  }
}

export async function signOut() {
  try {
    deleteSession();
  } catch (error: any) {
    console.error(error);
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);

  return !!session?.userId;
}
