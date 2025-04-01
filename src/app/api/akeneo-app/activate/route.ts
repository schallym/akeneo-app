import * as crypto from "crypto";
import { env } from "../../../../../conf/env";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/utils";
import { akeneoAppScopes } from "@/lib/models";

export async function GET(req: NextRequest): Promise<Response> {
  try {
    console.log(req.nextUrl);
    const pimUrl = req.nextUrl?.searchParams.get("pim_url");
    if (!pimUrl) {
      return Response.json({ message: "PIM url is required" }, { status: 400 });
    }

    // Create a random state for preventing cross-site request forgery
    const state = crypto.randomBytes(64).toString("hex");

    // Build the parameters for the Authorization Request
    // https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1
    const params = new URLSearchParams({
      response_type: "code",
      client_id: env.AKENEO_APP_CLIENT_ID,
      scope: akeneoAppScopes.join(" "),
      state: state,
    });

    // Build the url for the Authorization Request using the PIM URL
    const authorizeUrl = pimUrl + "/connect/apps/v1/authorize?" + params.toString();

    // Save the app.
    const app = await prisma.akeneoApp.findUnique({
      where: { pimUrl: pimUrl },
    });
    if (!app) {
      await prisma.akeneoApp.create({ data: { pimUrl: pimUrl, state: state } });
    } else {
      await prisma.akeneoApp.update({
        where: { id: app.id },
        data: { state: state },
      });
    }

    return Response.redirect(authorizeUrl);
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
