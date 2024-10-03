"use server";

import { getMainApp } from "@/lib/repositories/app.repository";
import { createAppClient } from "@dataggo/node-akeneo-api";

export async function testMainConnection(): Promise<void> {
  const app = await getMainApp();
  const akeneoClient = createAppClient({
    url: app.pimUrl,
    accessToken: app.apiToken as string,
    axiosOptions: {
      timeout: 300000, // 5mn
    },
  });

  await akeneoClient.product.get({
    query: {
      limit: 1,
      with_count: true,
    },
  });
}
