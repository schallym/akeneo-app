import { getMainApp } from "@/lib/repositories/app.repository";
import { createAppClient, Product } from "@dataggo/node-akeneo-api";

export async function handleUrlHistory(uuid: string) {
  const app = await getMainApp();
  const akeneoClient = createAppClient({
    url: app.pimUrl,
    accessToken: app.apiToken as string,
    axiosOptions: {
      timeout: 300000, // 5mn
    },
  });

  const product: Product = (await akeneoClient.raw.http.get(`/api/rest/v1/products-uuid/${uuid}`)).data;

  const seoUrlValue = product.values["seo_url"]?.[0]?.data;
  if (!seoUrlValue) {
    return;
  }

  const urlHistory = product.values["url_history"]?.[0]?.data ?? [];
  // Nothing is done if the last URL is the same as the current one
  if (urlHistory.length > 0 && urlHistory[urlHistory.length - 1]?.url === seoUrlValue) {
    return;
  }

  const date = new Date();
  urlHistory.push({
    url: seoUrlValue,
    date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`,
    auto_incremented_id: urlHistory[urlHistory.length - 1]?.auto_incremented_id
      ? +urlHistory[urlHistory.length - 1]?.auto_incremented_id + 1
      : 1,
  });

  await akeneoClient.raw.http.patch(`/api/rest/v1/products-uuid/${uuid}`, {
    values: {
      url_history: [
        {
          data: urlHistory,
          locale: null,
          scope: null,
        },
      ],
    },
  });
}
