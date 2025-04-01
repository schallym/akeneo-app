import * as crypto from "crypto";
import { env } from "../../../../../conf/env";
import { prisma } from "@/lib/utils";
import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import { signIn, signOut } from "@/lib/actions/auth";

type IdToken = {
  iss: string;
  jti: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  connection_code: string;
  firstname: string;
  lastname: string;
  email_verified: boolean;
  email: string;
};

export async function GET(req: any): Promise<Response> {
  try {
    console.log(req.nextUrl);
    const appClientSecret = env.AKENEO_APP_CLIENT_SECRET;
    const appClientId = env.AKENEO_APP_CLIENT_ID;

    const app = await prisma.akeneoApp.findUnique({
      where: { state: req.nextUrl?.searchParams.get("state") },
    });
    // We check if the received state is the same as in the session, for security.
    if (!app) {
      return Response.json({ message: "Invalid state" }, { status: 400 });
    }

    const authorizationCode = req.nextUrl?.searchParams.get("code");
    if (!authorizationCode) {
      return Response.json({ message: "Missing authorization code" }, { status: 400 });
    }

    // Generate code for token request
    const codeIdentifier = crypto.randomBytes(64).toString("hex");
    const codeChallenge = crypto
      .createHash("sha256")
      .update(codeIdentifier + appClientSecret)
      .digest("hex");

    // Build form data to post
    const accessTokenRequestPayload = new URLSearchParams({
      grant_type: "authorization_code",
      code: authorizationCode,
      client_id: appClientId,
      code_identifier: codeIdentifier,
      code_challenge: codeChallenge,
    });

    // Make an authenticated call to the API
    const accessTokenUrl = app.pimUrl + "/connect/apps/v1/oauth2/token";
    const response = await fetch(accessTokenUrl, {
      method: "post",
      body: accessTokenRequestPayload.toString(),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const result = await response.json();

    const apiToken = result.access_token;
    if (!apiToken) {
      return Response.json({ message: "Missing access token in response" }, { status: 500 });
    }
    await prisma.akeneoApp.update({
      where: { id: app.id },
      data: { apiToken },
    });

    const userToken: IdToken = jwtDecode(result.id_token);
    const user = await prisma.user.findUnique({
      where: { email: userToken.email },
    });
    if (!user) {
      await prisma.user.create({
        data: {
          email: userToken.email,
          name: userToken.firstname + " " + userToken.lastname,
        },
      });
    }

    await signOut();
    await signIn(userToken.email);

    return NextResponse.redirect(req.nextUrl.origin, { status: 307 });
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
