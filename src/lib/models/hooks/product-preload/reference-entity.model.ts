export type ReferenceEntityValue = {
  locale: string | null;
  scope: string | null;
  premium_partner: string | number | object | null;
  manufacturer_address: string | number | object | null;
};

export type ReferenceEntity = {
  code: string;
  values: Record<string, ReferenceEntityValue[]>;
  created: string | null;
  updated: string | null;
};
