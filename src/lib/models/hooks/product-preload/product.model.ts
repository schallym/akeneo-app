export type ProductValue = {
  locale: string | null;
  scope: string | null;
  data: string | number | object | null;
  attribute_type: string;
};

export type Product = {
  uuid: string;
  family: string;
  values: Record<string, ProductValue[]>;
};
