import { fetchActiveCompanies } from "@/lib/company/fetchActiveCompanies";
import { CatalogEndpoints, fetchAllCatalogsByType, fetchCatalog } from "@/lib/catalog/fetch";
import { FiltersResponse } from "@/types/search";

const filters: CatalogEndpoints[] = [
  "filtroFechas",
  "experiencia",
  "modalidadTrabajo",
]

export async function fetchFilters() {
  try {
    const [catalogResults, activeCompanies, ciudad] = await Promise.all([
      Promise.all(filters.map((endpoint) => fetchCatalog(endpoint))),
      fetchActiveCompanies(),
      fetchAllCatalogsByType("ciudad"),
    ]);

    const response = filters.reduce((acc, endpoint, i) => {
      acc[endpoint] = catalogResults[i];
      return acc;
    }, {} as FiltersResponse);

    return {
      ...response,
      activeCompanies,
      ciudad,
    } as FiltersResponse;
  } catch (error) {
    console.warn("Issue getting all filters", error);
  }
}
