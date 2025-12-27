import { fetchAllCatalogsByType } from "@/lib/catalog/fetch";
import { DATOS_PERSONALES_TYPES, DatosPersonalesFieldsResponse } from "@/types/user";

export async function fetchDatosPersonalesFields(): Promise<DatosPersonalesFieldsResponse | null> {
  try {
    const results = await Promise.all(
      DATOS_PERSONALES_TYPES.map(fetchAllCatalogsByType)
    );

    return Object.fromEntries(
      DATOS_PERSONALES_TYPES.map((type, i) => [
        type.toLowerCase(),
        results[i],
      ])
    );
  } catch (error) {
    console.warn("Issue getting form fields", error);
    return null;
  }
}
