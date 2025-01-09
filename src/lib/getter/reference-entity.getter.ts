import { getMainApp } from "@/lib/repositories/app.repository";
import { createAppClient } from "@dataggo/node-akeneo-api";

export async function handleReferenceEntityGetter(referenceEntityName: string, referenceEntityId: string) {
  const app = await getMainApp();
  console.log(app);
  const akeneoClient = createAppClient({
    //url: app.pimUrl,
    url: "https://jessy.support.cloud.akeneo.com/",
    accessToken: app.apiToken as string,
    axiosOptions: {
      timeout: 300000, // 5mn
    },
  });

  const value: object = (
    await akeneoClient.raw.http.get(
      `/api/rest/v1/reference-entities/${referenceEntityName}/attributes/${referenceEntityId}`,
    )
  ).data;

  console.log(value);

  /*if (!bundle || bundle.family !== "ipsy_bundles") {
    console.log(`Product ${uuid} is not a bundle`);
    return;
  }

  if (bundle?.values?.bundle_dynamic_weight?.at(0)?.data !== true) {
    console.log(`Bundle ${uuid} is not dynamic weight`);
    return;
  }

  let bundleWeight = 0;
  const bundleProductIds = bundle?.quantified_associations?.bundle?.products.map(
    // @ts-ignore
    (product: { quantity: number; uuid: string }) => product.uuid,
  );

  if (bundleProductIds && bundleProductIds.length > 0) {
    const bundleProducts: Product[] = (
      await akeneoClient.raw.http.get(
        `/api/rest/v1/products-uuid?search={"uuid":[{"operator":"IN","value":["${bundleProductIds.join('","')}"]}]}&limit=100`,
      )
    ).data._embedded.items;
    bundleWeight = bundleProducts.reduce((acc, product) => {
      const weight =
        (Number(product.values.Product_Weight?.[0]?.data?.amount) || 0) *
        // @ts-ignore
        bundle?.quantified_associations?.bundle?.products.find((p) => p.uuid === product.uuid)?.quantity;
      return acc + weight;
    }, 0);
  }

  console.log(`Bundle weight for bundle ${uuid} is ${bundleWeight}`);

  await akeneoClient.raw.http.patch(`/api/rest/v1/products-uuid/${uuid}`, {
    values: {
      bundle_weight: [
        {
          data: {
            amount: bundleWeight,
            unit: "OUNCE",
          },
          locale: null,
          scope: null,
        },
      ],
    },
  });*/
}
