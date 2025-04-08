"use server";

import { getMainApp } from "@/lib/repositories/app.repository";
import { AttributeOption, createAppClient, Product } from "@dataggo/node-akeneo-api";

export type Channel = {
  code: string;
  currencies: string[];
  locales: string[];
  category_tree: string;
  conversion_units: Record<string, string>;
  labels: Record<string, string>;
};

export async function getAllChannels(): Promise<Channel[]> {
  const app = await getMainApp();
  const akeneoClient = createAppClient({
    url: app.pimUrl,
    accessToken: app.apiToken as string,
    axiosOptions: {
      timeout: 300000, // 5mn
    },
  });

  const channels = await akeneoClient.raw.http.get("/api/rest/v1/channels", {
    params: {
      // We assume that we have less than 100 channels
      limit: 100,
    },
  });

  return channels.data["_embedded"].items;
}

export async function getOneProductById(identifier: string): Promise<Product> {
  const app = await getMainApp();
  const akeneoClient = createAppClient({
    url: app.pimUrl,
    accessToken: app.apiToken as string,
    axiosOptions: {
      timeout: 300000, // 5mn
    },
  });

  return await akeneoClient.product.getOne({ code: identifier });
}

export async function getAttributeOptions(attributeCode: string): Promise<AttributeOption[]> {
  const app = await getMainApp();
  const akeneoClient = createAppClient({
    url: app.pimUrl,
    accessToken: app.apiToken as string,
    axiosOptions: {
      timeout: 300000, // 5mn
    },
  });

  const optionsList = await akeneoClient.attribute.getOptions({
    attributeCode,
  });

  return optionsList.items;
}

export async function updateProduct(uuid: string, product: Partial<Product>): Promise<Product> {
  const app = await getMainApp();
  const akeneoClient = createAppClient({
    url: app.pimUrl,
    accessToken: app.apiToken as string,
    axiosOptions: {
      timeout: 300000, // 5mn
    },
  });

  try {
    if (product.identifier) {
      // Remove the identifier from the product object
      delete product.identifier;
    }
    const response = await akeneoClient.raw.http.patch(`/api/rest/v1/products-uuid/${uuid}`, product, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Update product response", response.data);

    return response.data;
  } catch (error) {
    console.error("Error updating product", error);
    throw new Error("Failed to update product");
  }
}
