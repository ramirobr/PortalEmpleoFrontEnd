export type Children = {
  children: React.ReactNode;
}

export type CatalogFieldsFromTypes<
  T extends readonly string[],
  V
> = {
    [K in T[number]as Lowercase<K>]?: V;
  };

export type IdProp = {
  params: Promise<{ id: string }>;
};