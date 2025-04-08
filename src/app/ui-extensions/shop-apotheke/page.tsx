"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@dataggo/node-akeneo-api";
import { getAllChannels, Channel, getOneProductById, getAttributeOptions, updateProduct } from "@/lib/api/akeneo";

const Table = dynamic(() => import("akeneo-design-system").then((mod) => mod.Table));
const TableHeader = dynamic(() => import("akeneo-design-system").then((mod) => mod.Table.Header));
const TableRow = dynamic(() => import("akeneo-design-system").then((mod) => mod.Table.Row));
const TableCell = dynamic(() => import("akeneo-design-system").then((mod) => mod.Table.Cell));
const TableBody = dynamic(() => import("akeneo-design-system").then((mod) => mod.Table.Body));
const TableHeaderCell = dynamic(() => import("akeneo-design-system").then((mod) => mod.Table.HeaderCell));
const Checkbox = dynamic(() => import("akeneo-design-system").then((mod) => mod.Checkbox));

export default function ShopApothekeUIExtension() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [attributeOptions, setAttributeOptions] = useState<any[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  // Track the checked state separately from the product
  const [checkedOptions, setCheckedOptions] = useState<Record<string, boolean>>({});
  // Add loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Add success indicator state
  const [showSuccessIndicator, setShowSuccessIndicator] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const productId = searchParams.get("product[identifier]");

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        // Create an array of promises to execute in parallel
        const promises: any = [getAllChannels(), getAttributeOptions("shop_apotheke_indications")];
        if (productId) {
          promises.push(getOneProductById(productId));
        }

        // Execute all promises in parallel
        const results = await Promise.all(promises);

        // Destructure results
        const [channelsData, optionsData, productData] = results;

        setChannels(channelsData);
        setAttributeOptions(optionsData);

        if (productData) {
          setProduct(productData);

          // Initialize checkedOptions from product data
          const initialCheckedOptions: Record<string, boolean> = {};
          if (productData?.values?.["shop_apotheke_indications"]) {
            productData.values["shop_apotheke_indications"].forEach((value: any) => {
              const { scope, data: optionCodes } = value;
              if (scope && optionCodes && Array.isArray(optionCodes)) {
                optionCodes.forEach((code: string) => {
                  initialCheckedOptions[`${code}-${scope}`] = true;
                });
              }
            });
          }
          setCheckedOptions(initialCheckedOptions);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  // Hide success indicator after 3 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showSuccessIndicator) {
      timer = setTimeout(() => {
        setShowSuccessIndicator(false);
      }, 2000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showSuccessIndicator]);

  const isProductOptionChecked = (attributeOptionCode: string, channelCode: string) => {
    // Use the dedicated state for checkbox status
    return checkedOptions[`${attributeOptionCode}-${channelCode}`];
  };

  const handleValueChange = async (attributeOptionCode: string, channelCode: string) => {
    if (!product) {
      return;
    }

    // Create a deep clone of the product to avoid modifying the state directly
    const updatedProduct = JSON.parse(JSON.stringify(product));
    const attributeValue = updatedProduct.values["shop_apotheke_indications"] || [];

    // Toggle the checked status in our dedicated state
    const optionKey = `${attributeOptionCode}-${channelCode}`;
    const newCheckedOptions = {
      ...checkedOptions,
      [optionKey]: !checkedOptions[optionKey],
    };
    setCheckedOptions(newCheckedOptions);

    const isCurrentlyChecked = newCheckedOptions[optionKey];

    // Find the index for this channel
    const channelIndex = attributeValue.findIndex((value: any) => value.scope === channelCode);

    if (channelIndex === -1) {
      // If no options exist for this channel and we're checking the box
      if (isCurrentlyChecked) {
        attributeValue.push({
          locale: null,
          scope: channelCode,
          data: [attributeOptionCode],
        });
      }
      // If unchecking and the channel doesn't exist, nothing to do
    } else {
      // Channel exists, update its data
      if (isCurrentlyChecked) {
        // Add the code if it's not already there
        if (!attributeValue[channelIndex].data.includes(attributeOptionCode)) {
          attributeValue[channelIndex].data.push(attributeOptionCode);
        }
      } else {
        // Remove the code
        attributeValue[channelIndex].data = attributeValue[channelIndex].data.filter(
          (code: string) => code !== attributeOptionCode,
        );
      }
    }

    // Update the product with the new attribute values
    updatedProduct.values["shop_apotheke_indications"] = attributeValue;

    setProduct(updatedProduct);
    try {
      await updateProduct(updatedProduct.uuid, updatedProduct);
      // Show success indicator
      setShowSuccessIndicator(true);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-middle">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-4 text-gray-600">Loading data...</p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableHeaderCell>
            <div className="flex mx-auto">Indication</div>
          </TableHeaderCell>
          {(channels ?? []).map((channel) => (
            <TableHeaderCell key={channel.code}>
              <div className="flex justify-center">{channel.labels.en || channel.code}</div>
            </TableHeaderCell>
          ))}
        </TableHeader>
        <TableBody>
          {(attributeOptions ?? []).map((attributeOption) => (
            <TableRow key={`${attributeOption.code}-row`}>
              <TableCell>{`${attributeOption.code} - ${attributeOption.labels.en_US}`}</TableCell>
              {(channels ?? []).map((channel) => (
                <TableCell key={`${channel.code}-${attributeOption.code}-cell`}>
                  <div className="flex mx-auto">
                    <Checkbox
                      checked={isProductOptionChecked(attributeOption.code, channel.code)}
                      onChange={() => handleValueChange(attributeOption.code, channel.code)}
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Success Indicator - now positioned directly under the table */}
      <div
        className={`mt-4 transition-all duration-500 ${
          showSuccessIndicator ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-lg flex items-center">
          <div className="mr-3">
            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Changes saved successfully!</p>
            <p className="text-sm">Product attributes have been updated.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
