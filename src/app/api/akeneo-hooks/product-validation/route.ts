export async function POST(req: any): Promise<Response> {
  const body = await req.json();

  return Response.json({ errors: [{ global: true, message: "ce que je veux" }] }, { status: 200 });
}
