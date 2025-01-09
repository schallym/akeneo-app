import { getMainApp } from "@/lib/repositories/app.repository";
import { createAppClient, EntityRecord } from "@dataggo/node-akeneo-api";

export async function handleReferenceEntityGetter(
  referenceEntityName: string,
  referenceEntityId: string,
): Promise<EntityRecord> {
  const app = await getMainApp();
  const akeneoClient = createAppClient({
    url: app.pimUrl,
    accessToken: app.apiToken as string,
    axiosOptions: {
      timeout: 300000, // 5mn
    },
  });

  return (
    await akeneoClient.raw.http.get(
      `/api/rest/v1/reference-entities/${referenceEntityName}/records/${referenceEntityId}`,
    )
  ).data;
}
