import { fetchApi } from "../apiClient";

export interface ExperienciaLaboral {
  Empresa: string;
  Titulo: string;
  Puesto: string;
  Institucion: string;
  Nivel: string;
  FechaInicio: string;
  FechaFin: string;
  Pais: string;
  Actual: boolean;
}

export async function fetchExperienciaLaboral() {
  // En desarrollo, usar mock local
  if (process.env.NODE_ENV === "development") {
    const experiencia = await import("../mocks/experienciaLaboral.json");
    return experiencia.default as ExperienciaLaboral[];
  }

  // En producción, llamar al API real
  const json = await fetchApi<{ data: ExperienciaLaboral[] }>(
    "/Profile/getExperienciaLaboral"
  );
  return json?.data ?? [];
}
