import { fetchApi } from "../apiClient";

export interface ResumenProfesional {
  Resumen: string;
  sueldo: string;
}

export async function fetchResumenProfesional(): Promise<ResumenProfesional | null> {
  if (process.env.NODE_ENV === "development") {
    const data = await import("../mocks/resumenProfesional.json");
    return data.default as ResumenProfesional;
  }
  return fetchApi<ResumenProfesional>("/api/resumen-profesional");
}
