import { handleReferenceEntityGetter } from "@/lib/getter/reference-entity.getter";
import { Message } from "@/lib/models/hooks/product-preload/message.model";
import { Product } from "@/lib/models/hooks/product-preload/product.model";
import { ReferenceEntity } from "@/lib/models/hooks/product-preload/reference-entity.model";

export async function POST(req: any): Promise<Response> {
  const messages: Message[] = [];
  const payload = await req.json();
  const product = payload.product;

  //programX sandbox
  if (product.family !== "Cushions") {
    return Response.json({ messages }, { status: 200 });
  }

  const manufacturer = readProductValue(product, "Manufacturer", null, null) as string | null;
  const referenceDataName = product.values.Manufacturer?.at(0).reference_data_name as string | null;

  if (null !== manufacturer && null !== referenceDataName) {
    const record = await handleReferenceEntityGetter(referenceDataName, manufacturer);
    console.log(record?.values?.premium_partner);
    const isPremium = "yes" === (record?.values?.premium_partner[0]?.data as string | null);

    if (isPremium) {
      messages.push({
        level: "primary",
        title: "Premium partner",
        details: ["This product is supplied by a Premium Partner"],
        icon: "StarIcon",
      });
    }
  }

  return Response.json({ messages }, { status: 200 });
}

/**
 * Helper to read a product value
 */
const readProductValue = (
  product: Product,
  code: string,
  locale: string | null,
  scope: string | null,
): string | number | object | null => {
  if (!product.values[code]) {
    return null;
  }
  const values = product.values[code];

  const value = values.find((item) => item.locale === locale && item.scope === scope);

  return value?.data || null;
};
