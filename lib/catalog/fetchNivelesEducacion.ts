import { fetchApi } from "../apiClient";

export interface NivelEducacion {
  key: string;
  value: string;
}

export async function fetchNivelesEducacion() {
  // En desarrollo, usar mock local
  if (process.env.NODE_ENV === "development") {
    const niveles = await import("../mocks/nivelEducacion.json");
    return niveles.default as NivelEducacion[];
  }

  // En producción, llamar al API real
  const json = await fetchApi<{ data: NivelEducacion[] }>(
    "/Profile/getNivelesEducacion"
  );
  return json?.data ?? [];
}
