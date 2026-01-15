import { CatalogTypes, fetchAllCatalogsByType } from "@/lib/catalog/fetch";
import { FormFieldsResponse } from "@/types/company";

const CATALOG_TYPES = [
  "CIUDAD",
  "INDUSTRIA",
  "CANTIDAD_EMPLEADOS",
  "CONDICION_FISCAL",
  "GENERO"
] as const satisfies readonly CatalogTypes[];

export async function fetchFormFields(): Promise<FormFieldsResponse | null> {
  try {
    const [
      ciudad,
      industria,
      cantidadEmpleados,
      condicionFiscal,
      genero
    ] = await Promise.all(
      CATALOG_TYPES.map(fetchAllCatalogsByType)
    );

    return {
      ciudad,
      industria,
      cantidadEmpleados,
      condicionFiscal,
      genero
    } as FormFieldsResponse;
  } catch (error) {
    console.warn("Issue getting form fields", error);
    return null;
  }
}
