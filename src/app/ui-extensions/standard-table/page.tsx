"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EntityRecord, Product } from "@dataggo/node-akeneo-api";
import { getOneProductById, updateProduct, getReferenceEntityRecords } from "@/lib/api/akeneo";

const TableInput = dynamic(() => import("akeneo-design-system").then((mod) => mod.TableInput));
const TableHeader = dynamic(() => import("akeneo-design-system").then((mod) => mod.TableInput.Header));
const TableRow = dynamic(() => import("akeneo-design-system").then((mod) => mod.TableInput.Row));
const TableBody = dynamic(() => import("akeneo-design-system").then((mod) => mod.TableInput.Body));
const TableHeaderCell = dynamic(() => import("akeneo-design-system").then((mod) => mod.TableInput.HeaderCell));
const Button = dynamic(() => import("akeneo-design-system").then((mod) => mod.Button));
const TableInputCell = dynamic(() => import("akeneo-design-system").then((mod) => mod.TableInput.Cell));
const TableInputSelect = dynamic(() => import("akeneo-design-system").then((mod) => mod.TableInput.Select));
const TableInputNumber = dynamic(() => import("akeneo-design-system").then((mod) => mod.TableInput.Number));
const DropdownItem = dynamic(() => import("akeneo-design-system").then((mod) => mod.Dropdown.Item));

type TableRow = {
  standard: string | null;
  standardClass: string | null;
  standardClassChoices?: string[] | null;
  performance: number | null;
};

export default function ShopApothekeUIExtension() {
  const [standards, setStandards] = useState<EntityRecord[]>([]);
  const [searchableStandards, setSearchableStandards] = useState<EntityRecord[]>([]);
  const [searchableStandardValue, setSearchableStandardValue] = useState<string>("");
  const [standardClasses, setStandardClasses] = useState<EntityRecord[]>([]);
  const [searchableStandardClasses, setSearchableStandardClasses] = useState<EntityRecord[]>([]);
  const [searchableStandardClassValue, setSearchableStandardClassValue] = useState<string>("");
  const [rows, setRows] = useState<TableRow[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
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
        const promises: any = [getReferenceEntityRecords("standard"), getReferenceEntityRecords("standard_class")];
        if (productId) {
          promises.push(getOneProductById(productId));
        }

        // Execute all promises in parallel and set data accordingly.
        const results = await Promise.all(promises);
        const [standards, standardClasses, productData] = results;
        setStandards(standards);
        setStandardClasses(standardClasses);

        if (productData) {
          setProduct(productData);
          const standardsData = productData.values["Standards"]?.find((value: any) => value.locale === "en_GB")
            ?.data as TableRow[];
          if (Array.isArray(standardsData)) {
            setRows(
              standardsData.map((row) => ({
                standard: row.standard ?? null,
                standardClass: row.standardClass ?? null,
                performance: row.performance ?? 0,
                standardClassChoices:
                  standards.find((s: any) => s.code === row.standard)?.values?.standard_classes?.[0].data || [],
              })),
            );
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  // Hide success indicator after 2 seconds
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

  const handleValueChange = async () => {
    if (!product) {
      return;
    }

    // Validate all row are filled
    if (rows.some((row) => !row.standard || !row.standardClass || row.performance === null)) {
      return;
    }

    // Create a deep clone of the product to avoid modifying the state directly
    const updatedProduct: Product = JSON.parse(JSON.stringify(product));
    updatedProduct.values["Standards"] = [
      {
        locale: "en_GB",
        scope: null,
        data: rows.map((row) => ({
          standard: row.standard,
          standardClass: row.standardClass,
          performance: row.performance,
        })),
      },
    ];

    setProduct(updatedProduct);
    try {
      await updateProduct(updatedProduct.uuid as string, updatedProduct);
      // Show success indicator
      setShowSuccessIndicator(true);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const addRow = () => {
    const newRow: TableRow = {
      standard: null,
      standardClass: null,
      performance: 0,
    };
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const updateSearchableStandards = (value: string) => {
    if (!value) {
      resetSearchableStandards();
      return;
    }

    setSearchableStandardValue(value);
    const filteredStandards = standards.filter((standard) => {
      const label = (standard.values.label?.find((l) => l.locale === "en_GB")?.data as string) || "";
      return label.toLowerCase().includes(value.toLowerCase());
    });
    setSearchableStandards(filteredStandards);
  };

  const resetSearchableStandards = () => {
    setSearchableStandardValue("");
    setSearchableStandards(standards);
  };

  const updateSearchableStandardClasses = (value: string, row?: TableRow) => {
    if (!value) {
      if (!!row) {
        // If a row is provided, filter standard classes based on the row's standard class choices
        const filteredStandardClasses = standardClasses.filter((standardClass) =>
          (row.standardClassChoices ?? []).includes(standardClass.code),
        );
        setSearchableStandardClasses(filteredStandardClasses);

        return;
      }

      resetSearchableStandardClasses();
      return;
    }

    setSearchableStandardClassValue(value);
    const filteredStandardClasses = standardClasses.filter((standardClass) => {
      const label = (standardClass.values.label?.find((l) => l.locale === "en_GB")?.data as string) || "";
      return label.toLowerCase().includes(value.toLowerCase());
    });
    setSearchableStandardClasses(filteredStandardClasses);
  };

  const resetSearchableStandardClasses = () => {
    setSearchableStandardClassValue("");
    setSearchableStandardClasses(standardClasses);
  };

  const updateRowStandard = async (index: number, standardCode: string) => {
    const standardClassChoices = standards.find((s) => s.code === standardCode)?.values?.standard_classes?.[0]
      .data as string[];
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[index] = {
        ...updatedRows[index],
        standard: standardCode,
        standardClassChoices: standardClassChoices,
        standardClass: standardClassChoices.includes(updatedRows[index].standardClass ?? "")
          ? updatedRows[index].standardClass
          : null,
      };

      return updatedRows;
    });

    await handleValueChange();
  };

  const updateRowStandardClass = async (index: number, standardClassCode: string) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[index] = {
        ...updatedRows[index],
        standardClass: standardClassCode,
      };

      return updatedRows;
    });

    await handleValueChange();
  };

  const updateRowPerformance = async (index: number, performance: number) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[index] = {
        ...updatedRows[index],
        performance: performance,
      };

      return updatedRows;
    });

    await handleValueChange();
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
      <TableInput>
        <TableHeader>
          <TableHeaderCell key="standard">
            <div className="flex justify-center">Standard</div>
          </TableHeaderCell>
          <TableHeaderCell key="standard-class">
            <div className="flex justify-center">Standard Class</div>
          </TableHeaderCell>
          <TableHeaderCell key="performance">
            <div className="flex justify-center">Performance (Only numeric values should be input)</div>
          </TableHeaderCell>
        </TableHeader>
        <TableBody>
          {(rows ?? []).map((row, index) => (
            <TableRow key={`row-${index}`}>
              <TableInputCell>
                <TableInputSelect
                  clearLabel="Remove"
                  onClear={() => resetSearchableStandards()}
                  onSearchChange={(value) => updateSearchableStandards(value)}
                  openDropdownLabel="Open"
                  searchPlaceholder="Search on standards"
                  searchTitle="Search"
                  searchValue={searchableStandardValue}
                  value={row.standard ?? null}
                >
                  {(searchableStandards ?? []).map((standard) => (
                    <DropdownItem
                      key={`standard-${standard.code}`}
                      onClick={() => updateRowStandard(index, standard.code)}
                    >
                      {(standard.values.label ?? []).find((value) => value.locale === "en_GB")?.data}
                    </DropdownItem>
                  ))}
                </TableInputSelect>
              </TableInputCell>
              <TableInputCell>
                <TableInputSelect
                  clearLabel="Remove"
                  onClear={() => resetSearchableStandardClasses()}
                  onSearchChange={(value) => updateSearchableStandardClasses(value)}
                  onOpenChange={() => updateSearchableStandardClasses("", row)}
                  openDropdownLabel="Open"
                  searchPlaceholder="Search on standards"
                  searchTitle="Search"
                  searchValue={searchableStandardClassValue}
                  value={row.standardClass ?? null}
                >
                  {(searchableStandardClasses ?? []).map((standardClass) => (
                    <DropdownItem
                      key={`standard-${standardClass.code}`}
                      onClick={() => updateRowStandardClass(index, standardClass.code)}
                    >
                      {(standardClass.values.label ?? []).find((value) => value.locale === "en_GB")?.data}
                    </DropdownItem>
                  ))}
                </TableInputSelect>
              </TableInputCell>
              <TableInputCell>
                <TableInputNumber
                  onChange={(performance) => updateRowPerformance(index, Number(performance))}
                  value={String(row.performance ?? 0)}
                />
              </TableInputCell>
            </TableRow>
          ))}
        </TableBody>
      </TableInput>
      <Button level="primary" onClick={addRow} className="mt-4">
        Add Row
      </Button>

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
