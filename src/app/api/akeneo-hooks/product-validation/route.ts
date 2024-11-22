export async function POST(req: any): Promise<Response> {
  const body = await req.json();

  return Response.json({ errors: [] }, { status: 200 });
}
