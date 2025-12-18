import { fetchAllCatalogsByType } from "@/lib/catalog/fetch";
import { FormFieldsResponse } from "@/types/company";

export async function fetchFormFields() {
  try {
    const [ciudad, industria, cantidadEmpleados, condicionFiscal] = await Promise.all([
      fetchAllCatalogsByType("CIUDAD"),
      fetchAllCatalogsByType("INDUSTRIA"),
      fetchAllCatalogsByType("CANTIDAD_EMPLEADOS"),
      fetchAllCatalogsByType("CONDICION_FISCAL")
    ]);

    return {
      ciudad,
      industria,
      cantidadEmpleados,
      condicionFiscal
    } as FormFieldsResponse;
  } catch (error) {
    console.warn("Issue getting form fields", error);
  }
}
