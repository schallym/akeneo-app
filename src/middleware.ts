import { NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

export default async function middleware() {
  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);

  /*if (!session?.userId) {
    throw new Error("Unauthorized");
  }*/

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
