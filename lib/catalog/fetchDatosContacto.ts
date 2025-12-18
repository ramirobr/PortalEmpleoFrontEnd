import { fetchApi } from "../apiClient";

export interface DatosContacto {
  celular: string;
  telefono: string;
  email: string;
  direccion: string;
}

export async function fetchDatosContacto(): Promise<DatosContacto | null> {
  if (process.env.NODE_ENV === "development") {
    const data = await import("../mocks/datosContacto.json");
    return data.default as DatosContacto;
  }
  return fetchApi<DatosContacto>("/api/datos-contacto");
}
