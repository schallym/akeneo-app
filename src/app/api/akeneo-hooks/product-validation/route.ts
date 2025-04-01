export async function POST(req: any): Promise<Response> {
  const body = await req.json();

  return Response.json(
    {
      errors: [
        {
          global: true,
          message: "global error message 01",
        },
        {
          attribute: {
            code: "description",
            locale: "en_US",
            scope: "ecommerce",
            invalid_value: "description",
          },
          message: "error message for attr_01",
        },
      ],
    },
    { status: 200 },
  );
}
