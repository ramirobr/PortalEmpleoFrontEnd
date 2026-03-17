import { fetchAllCatalogsByType } from "../catalog/fetch";
import { fetchAllJobs, JobFilters } from "./job";

export async function fetchRoleItems(role: string, extraFilters: JobFilters = {}) {
  let filters: JobFilters = { ...extraFilters };

  if (role === "pasante") {
    const experienceCatalogs = await fetchAllCatalogsByType("EXPERIENCIA");
    const pasanteCatalog = experienceCatalogs?.find(
      (c) => c.nombre.toLowerCase().includes("pasante") || 
             c.nombre.toLowerCase().includes("pasantía")
    );
    if (pasanteCatalog) {
      filters.idExperiencia = pasanteCatalog.idCatalogo;
    } else {
      filters.searchTerm = "pasante";
    }
  } else if (role === "horas") {
    const modalityCatalogs = await fetchAllCatalogsByType("MODALIDAD_TRABAJO");
    const horasCatalog = modalityCatalogs?.find(
      (c) => c.nombre.toLowerCase().includes("horas")
    );
    if (horasCatalog) {
      filters.idModalidadTrabajo = horasCatalog.idCatalogo;
    } else {
      filters.searchTerm = "horas";
    }
  }

  return await fetchAllJobs({
    ...filters,
    pageIndex: filters.pageIndex || 1,
    pageSize: filters.pageSize || 50,
  });
}
