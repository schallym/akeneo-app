import { NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

export default async function middleware() {
  const cookie = cookies().get("session")?.value;
  console.log("Cookie", cookies().get("session"));

  const session = await decrypt(cookie);

  console.log("Session", session);

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|ui-extensions|.*\\.png$).*)"],
};
