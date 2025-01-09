export type ReferenceEntityValue = {
  locale: string | null;
  scope: string | null;
  data: string | number | object | null;
};

export type ReferenceEntity = {
  code: string;
  values: Record<string, ReferenceEntityValue[]>;
};
