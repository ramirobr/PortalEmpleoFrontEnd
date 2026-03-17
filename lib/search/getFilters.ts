import { fetchAllCatalogsByType } from "@/lib/catalog/fetch";
import { fetchActiveCompanies } from "@/lib/company/fetchActiveCompanies";
import { FILTERS } from "@/types/search";
import { mapCatalogsToResponse } from "../utils";

export async function fetchFilters() {
  try {
    const [results, activeCompanies] = await Promise.all([
      Promise.all(FILTERS.map(fetchAllCatalogsByType)),
      fetchActiveCompanies(),
    ]);

    return {
      activeCompanies,
      ...mapCatalogsToResponse(FILTERS, results),
    };
  } catch (error) {
    console.warn("Issue getting all filters", error);
  }
}
