"use server";

import { prisma } from "@/lib/utils";
import { AkeneoApp } from "@/lib/models";

export async function getMainApp(): Promise<AkeneoApp> {
  return prisma.akeneoApp.findFirstOrThrow();
}
