import { CatalogTypes, fetchAllCatalogsByType } from "@/lib/catalog/fetch";
import { fetchActiveCompanies } from "@/lib/company/fetchActiveCompanies";
import { FiltersResponse } from "@/types/search";

const filters: CatalogTypes[] = [
  "FILTRO_FECHAS",
  "EXPERIENCIA",
  "MODALIDAD_TRABAJO",
  "PROVINCIA",
  "CIUDAD"
]

export async function fetchFilters() {
  try {
    const [catalogResults, activeCompanies] = await Promise.all([
      Promise.all(filters.map((endpoint) => fetchAllCatalogsByType(endpoint))),
      fetchActiveCompanies(),
    ]);

    const response = filters.reduce((acc, endpoint, i) => {
      acc[endpoint] = catalogResults[i];
      return acc;
    }, {} as FiltersResponse);

    return {
      ...response,
      activeCompanies,
    } as FiltersResponse;
  } catch (error) {
    console.warn("Issue getting all filters", error);
  }
}
