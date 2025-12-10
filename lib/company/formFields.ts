import { CatalogEndpoints, fetchAllCatalogsByType, fetchCatalog } from "@/lib/catalog/fetch";
import { FormFieldsResponse } from "@/types/company";

const fields: CatalogEndpoints[] = [
  "condicionFiscal",
  "provincias",
  "industria",
  "cantidadEmpleados"
]

export async function fetchFormFields() {
  try {
    const [catalogResults, ciudad] = await Promise.all([
      Promise.all(fields.map((endpoint) => fetchCatalog(endpoint))),
      fetchAllCatalogsByType("ciudad"),
    ]);

    const response = fields.reduce((acc, endpoint, i) => {
      acc[endpoint] = catalogResults[i];
      return acc;
    }, {} as FormFieldsResponse);


    return {
      ...response,
      ciudad,
    } as FormFieldsResponse;
  } catch (error) {
    console.warn("Issue getting form fields", error);
  }
}
