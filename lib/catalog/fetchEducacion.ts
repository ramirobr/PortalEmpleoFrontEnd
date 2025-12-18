import { fetchApi } from "../apiClient";

export interface Educacion {
  Titulo: string;
  Institucion: string;
  Nivel: string;
  Fecha: string;
  Pais: string;
}

export async function fetchEducacion() {
  // En desarrollo, usar mock local
  if (process.env.NODE_ENV === "development") {
    const educacion = await import("../mocks/educacion.json");
    return educacion.default as Educacion[];
  }

  // En producción, llamar al API real
  const json = await fetchApi<{ data: Educacion[] }>("/Profile/getEducacion");
  return json?.data ?? [];
}
