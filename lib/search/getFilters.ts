import { fetchAllCatalogsByType } from "@/lib/catalog/fetch";
import { fetchActiveCompanies } from "@/lib/company/fetchActiveCompanies";
import { FILTERS } from "@/types/search";

export async function fetchFilters() {
  try {
    const [results, activeCompanies] = await Promise.all([
      Promise.all(FILTERS.map(fetchAllCatalogsByType)),
      fetchActiveCompanies(),
    ]);

    return {
      activeCompanies,
      ...Object.fromEntries(
        FILTERS.map((type, i) => [type.toLowerCase(), results[i]])
      ),
    };
  } catch (error) {
    console.warn("Issue getting all filters", error);
  }
}
