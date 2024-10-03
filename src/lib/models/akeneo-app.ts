export const akeneoAppScopes = [
  "read_catalogs",
  "write_catalogs",
  "delete_catalogs",
  "read_products",
  "write_products",
  "read_asset_families",
  "read_assets",
  "write_assets",
  "delete_assets",
  "read_catalog_structure",
  "read_attribute_options",
  "read_categories",
  "read_channel_localization",
  "read_channel_settings",
  "read_association_types",
  "read_reference_entities",
  "write_reference_entities",
  "read_reference_entity_records",
  "write_reference_entity_records",
  "openid",
  "email",
  "profile",
];

export type AkeneoApp = {
  id: string;
  pimUrl: string;
  apiToken: string | null;
  createdAt: Date;
  updatedAt: Date;
};
