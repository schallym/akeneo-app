import { handleIpsyBundleWeightUpdate } from "@/lib/updater";
import { handleUrlHistory } from "@/lib/updater/url-history.updater";

export async function GET(): Promise<Response> {
  return new Response("Subscription to product update event is successful", { status: 200 });
}

export async function POST(req: any): Promise<Response> {
  console.log("Received product update event");

  const body = await req.json();
  console.log(body);

  // // Handle the event
  // await handleIpsyBundleWeightUpdate(body.data.product.uuid);
  // await handleUrlHistory(body.data.product.uuid);

  return new Response("Product update event received", { status: 200 });
}
