import { fetchAllCatalogsByType } from "@/lib/catalog/fetch";
import { DATOS_PERSONALES_TYPES, DatosPersonalesFieldsResponse } from "@/types/user";
import { mapCatalogsToResponse } from "../utils";

export async function fetchDatosPersonalesFields(): Promise<DatosPersonalesFieldsResponse | null> {
  try {
    const results = await Promise.all(
      DATOS_PERSONALES_TYPES.map(fetchAllCatalogsByType)
    );

    return mapCatalogsToResponse(DATOS_PERSONALES_TYPES, results)
  } catch (error) {
    console.warn("Issue getting form fields", error);
    return null;
  }
}
