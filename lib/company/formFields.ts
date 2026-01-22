import { fetchAllCatalogsByType } from "@/lib/catalog/fetch";
import { CANDIDATOS_SEARCH_FILTERS, CandidatosSearchFiltersResponse, CREAR_EMPLEO_FILTERS, CrearEmpleoFiltersResponse, EMPRESA_FORM_FILTERS, FormFieldsResponse } from "@/types/company";
import { mapCatalogsToResponse } from "../utils";

export async function fetchFormFields(): Promise<FormFieldsResponse | null> {
  try {
    const results = await Promise.all(
      EMPRESA_FORM_FILTERS.map(fetchAllCatalogsByType)
    );
    return mapCatalogsToResponse(EMPRESA_FORM_FILTERS, results);
  } catch (error) {
    console.warn("Issue getting form fields", error);
    return null;
  }
}

export async function candidatosSearchFilters(): Promise<CandidatosSearchFiltersResponse | null> {
  try {
    const results = await Promise.all(
      CANDIDATOS_SEARCH_FILTERS.map(fetchAllCatalogsByType)
    );
    return mapCatalogsToResponse(CANDIDATOS_SEARCH_FILTERS, results);
  } catch (error) {
    console.warn("Issue getting filters", error);
    return null;
  }
}

export async function crearEmpleoFilters(): Promise<CrearEmpleoFiltersResponse | null> {
  try {
    const results = await Promise.all(
      CREAR_EMPLEO_FILTERS.map(fetchAllCatalogsByType)
    );
    return mapCatalogsToResponse(CREAR_EMPLEO_FILTERS, results);
  } catch (error) {
    console.warn("Issue getting crear empleo filters", error);
    return null;
  }
}
