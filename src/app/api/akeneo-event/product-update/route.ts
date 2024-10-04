import { handleIpsyBundleWeightUpdate } from "@/lib/updater";

export async function GET(): Promise<Response> {
  return new Response("Subscription to product update event is successful", { status: 200 });
}

export async function POST(req: any): Promise<Response> {
  const body = await req.json();

  // Handle the event
  await handleIpsyBundleWeightUpdate(body.data.product.uuid);

  return new Response("Product update event received", { status: 200 });
}
