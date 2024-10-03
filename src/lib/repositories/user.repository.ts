"use server";

import { prisma } from "@/lib/utils";
import { User } from "@/lib/models";

export async function getUserByEmail(email: string): Promise<User> {
  return prisma.user.findUniqueOrThrow({ where: { email } });
}
