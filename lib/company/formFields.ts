import { CatalogTypes, fetchAllCatalogsByType } from "@/lib/catalog/fetch";
import { FormFieldsResponse } from "@/types/company";

const CATALOG_TYPES = [
  "CIUDAD",
  "INDUSTRIA",
  "CANTIDAD_EMPLEADOS",
  "CONDICION_FISCAL"
] as CatalogTypes[];

export async function fetchFormFields(): Promise<FormFieldsResponse | null> {
  try {
    const [
      ciudad,
      industria,
      cantidadEmpleados,
      condicionFiscal
    ] = await Promise.all(
      CATALOG_TYPES.map(fetchAllCatalogsByType)
    );

    return {
      ciudad,
      industria,
      cantidadEmpleados,
      condicionFiscal
    } as FormFieldsResponse;
  } catch (error) {
    console.warn("Issue getting form fields", error);
    return null;
  }
}
