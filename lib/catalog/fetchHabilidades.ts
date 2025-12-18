import { fetchApi } from "../apiClient";

export interface Habilidad {
  nombre: string;
  nivel: string;
}

export async function fetchHabilidades(): Promise<Habilidad[]> {
  if (process.env.NODE_ENV === "development") {
    const data = await import("../mocks/habilidades.json");
    return data.default as Habilidad[];
  }
  const result = await fetchApi<Habilidad[]>("/api/habilidades");
  return result ?? [];
}
