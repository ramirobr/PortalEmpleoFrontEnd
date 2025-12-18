import { fetchApi } from "../apiClient";

export async function fetchPaises() {
  // En desarrollo, usar mock local
  if (process.env.NODE_ENV === "development") {
    const paises = await import("../mocks/paises.json");
    return Array.from(new Set(paises.default));
  }

  // En producción, llamar al API real
  const json = await fetchApi<{ data: string[] }>("/Profile/getPaises");
  return json?.data ? Array.from(new Set(json.data)) : [];
}
