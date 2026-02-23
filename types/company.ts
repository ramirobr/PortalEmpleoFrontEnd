import { CatalogTypes } from "@/lib/catalog/fetch";
import { CatalogsByType } from "./search";
import { GenericResponse } from "./user";
import { CatalogFieldsFromTypes } from "./generic";

export const EMPRESA_FORM_FILTERS = [
  "CIUDAD",
  "INDUSTRIA",
  "CANTIDAD_EMPLEADOS",
  "CONDICION_FISCAL",
  "GENERO",
] as const satisfies readonly CatalogTypes[];

export type FormFieldsResponse = CatalogFieldsFromTypes<
  typeof EMPRESA_FORM_FILTERS,
  CatalogsByType[]
>;

export const CANDIDATOS_SEARCH_FILTERS = [
  "PROVINCIA",
  "CIUDAD",
] as const satisfies readonly CatalogTypes[];

export type CandidatosSearchFiltersResponse = CatalogFieldsFromTypes<
  typeof CANDIDATOS_SEARCH_FILTERS,
  CatalogsByType[]
>;

export const CREAR_EMPLEO_FILTERS = [
  "CIUDAD",
  "MODALIDAD_TRABAJO",
  "EXPERIENCIA",
  "NIVEL_ESTUDIO",
] as const satisfies readonly CatalogTypes[];

export type CrearEmpleoFiltersResponse = CatalogFieldsFromTypes<
  typeof CREAR_EMPLEO_FILTERS,
  CatalogsByType[]
>;

export const COMPANY_PROFILE_FILTERS = [
  "ESTADO_EMPRESA",
  "CONDICION_FISCAL",
  "INDUSTRIA",
  "CANTIDAD_EMPLEADOS",
  "CIUDAD",
  "GENERO",
] as const satisfies readonly CatalogTypes[];

export type CompanyProfileFiltersResponse = CatalogFieldsFromTypes<
  typeof COMPANY_PROFILE_FILTERS,
  CatalogsByType[]
>;

export type CompanySignUpData = {
  nombreEmpresa: string;
  razonSocial: string;
  idCondicionFiscal: number;
  documento: string;
  idCiudad: number;
  calle: string;
  numeroCasa: string;
  codigoPostal: string;
  telefono: string;
  idIndustria: number;
  idCantidadEmpleados: number;
  sitioWeb: string;
  nombres: string;
  apellidos: string;
  idGenero?: number;
  email: string;
  password: string;
  aceptaTerminoCondiciones: boolean;
  quieroRecibirNewsLetter: boolean;
  quieroParticiparEncuestas: boolean;
};

// Tipos para ofertas de empleo de la empresa
export interface OfertaEmpleo {
  idVacante: string;
  tituloPuesto: string;
  descripcion: string;
  empresa: {
    idEmpresa: string;
    nombre: string;
  };
  ubicacion: string;
  totalAplicaciones: number;
  estadoVacante: {
    idEstadoVacante: number;
    nombre: string;
  };
  fechaPublicacion: string;
  fechaCierre: string;
}

export interface MisOfertasEmpleoPaginado {
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  data: OfertaEmpleo[];
}

export type GetMisOfertasEmpleoResponse =
  GenericResponse<MisOfertasEmpleoPaginado>;

export interface MisOfertasEmpleoParams {
  pageSize: number;
  currentPage: number;
  sortBy?: string;
  sortDirection?: string;
  idEmpresa: string;
  periodoBusqueda: string;
}

export interface AplicanteReciente {
  usuario: {
    idAplicacion: string;
    idUsuario: string;
    estadoAplicacion: {
      idEstadoAplicacion: number;
      nombre: string;
    };
    nombreCompleto: string;
    ubicacion: string;
    habilidades: string[];
    fotografia?: string;
    fechaAplicacion?: string;
  };
}

export interface NotificacionEmpresa {
  idNotificacion: string;
  descripcion: string;
  fechaCreacion: string;
  esLeida: boolean;
}

export interface CompanyDashboardInfoData {
  ofertarPublicadas: number;
  candidatosActivos: number;
  postulacionesRecibidas: number;
  aplicantesRecientes: AplicanteReciente[];
  notificacionesNoLeidas: number;
  notificacionesRecientes: NotificacionEmpresa[];
}

export type CompanyDashboardInfoResponse =
  GenericResponse<CompanyDashboardInfoData>;

// Usuario Administrador de empresa
export interface UsuarioAdministrador {
  idUsuario: string;
  nombre: string;
  apellido: string;
  nombreCompleto: string;
  correoElectronico: string;
  telefono: string;
  telefonoMovil?: string;
  tipoUsuario: {
    id: number;
    nombre: string;
  };
  estadoCuenta: {
    id: number;
    nombre: string;
  };
  genero: {
    id: number;
    nombre: string;
  };
  fechaRegistro: string;
}

// Perfil de empresa
export interface CompanyProfileData {
  idEmpresa: string;
  nombre: string;
  razonSocial: string;
  condicionFiscal: {
    id: number;
    nombre: string;
  };
  numeroDocumento: string;
  correoContacto: string;
  telefonoContacto: string;
  direccion: string;
  ciudad: {
    id: number;
    nombre: string;
  };
  provincia: {
    id: number;
    nombre: string;
  };
  pais: {
    id: number;
    nombre: string;
  };
  industria: {
    id: number;
    nombre: string;
  };
  cantidadEmpleados: {
    id: number;
    nombre: string;
  };
  estado: {
    id: number;
    nombre: string;
  };
  fechaRegistro: string;
  sitioWeb?: string;
  logoUrl?: string;
  descripcion?: string;
  usuarioAdministrador?: UsuarioAdministrador;
}

export type CompanyProfileResponse = GenericResponse<CompanyProfileData>;

// Postulación: candidato + vacante + estado (para lista de candidatos de empresa)
export type EstadoPostulacion = "Pendiente" | "Aprobada" | "Rechazada";

export interface PostulacionItem {
  idAplicacion: string;
  idUsuario: string;
  nombreCompleto: string;
  fotografia: string;
  correoElectronico: string;
  ciudadUsuario: string;
  tituloVacante: string;
  ciudadVacante: string;
  fechaPostulacion: string;
  estadoAplicacion: string;
  idEstadoAplicacion?: number;
  mensajeCandidato: string;
  archivoCV: string;
  habilidades: string[];
}

export interface GetAplicacionesByEmpresaResponse {
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  data: PostulacionItem[];
}

// Real API response for applicants
export interface AplicanteReal {
  idAplicacion: string;
  idUsuario: string;
  nombreCompleto: string;
  correoElectronico: string;
  fechaPostulacion: string;
  estadoAplicacion: string;
  mensajeCandidato: string;
}

export type GetAplicantesResponse = GenericResponse<AplicanteReal[]>;

// Tipos para búsqueda avanzada de candidatos
export const CANDIDATOS_SEARCH_ADVANCED_FILTERS = [
  "PROVINCIA",
  "CIUDAD",
  "NIVEL_ESTUDIO",
] as const satisfies readonly CatalogTypes[];

export type CandidateSearchFiltersResponse = CatalogFieldsFromTypes<
  typeof CANDIDATOS_SEARCH_ADVANCED_FILTERS,
  CatalogsByType[]
>;

export interface CandidateSearchFilters {
  idProvincia?: number;
  idCiudad?: number;
  idNivelEducacion?: number;
  idPreferenciaTurno?: number;
  edadMinima?: number;
  edadMaxima?: number;
  aspiracionSalarialMin?: number;
  aspiracionSalarialMax?: number;
  aniosExperienciaMin?: number;
  aniosExperienciaMax?: number;
  searchTerm?: string;
  pageSize: number;
  currentPage: number;
}

// Actualizado para coincidir con el endpoint real /Jobs/searchCandidates
export interface SearchCandidatesRequest {
  pageSize: number;
  currentPage: number;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: string;
  idPais?: number;
  idProvincia?: number;
  idCiudad?: number;
  idNivelEstudio?: number;
  idExperiencia?: number;
  aniosExperienciaMin?: number | null;
  aniosExperienciaMax?: number | null;
  idDisponibilidad?: number;
  edadMinima?: number | null;
  edadMaxima?: number | null;
  salarioMinimoEsperado?: number | null;
  salarioMaximoEsperado?: number | null;
  idGenero?: number;
  movilidadPropia?: boolean | null;
  poseeLicenciaConducir?: boolean | null;
  habilidades?: string[];
}

export interface CandidateSearchResult {
  idUsuario: string;
  nombreCompleto: string;
  correoElectronico: string;
  telefono: string;
  fotografia?: string;
  ciudad?: string;
  provincia?: string;
  pais?: string;
  nivelEstudioMaximo?: string;
  ultimoTitulo?: string;
  ultimaInstitucion?: string;
  aniosExperiencia: number;
  puestoActual?: string;
  empresaActual?: string;
  resumenProfesional?: string;
  disponibilidad?: string;
  edad: number;
  genero: string;
  movilidadPropia: boolean;
  poseeLicenciaConducir: boolean;
  tipoLicencia?: string;
  habilidades: string[];
  idiomas: string[];
  fechaRegistro: string;
}

export interface CandidateSearchPaginado {
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  data: CandidateSearchResult[];
}

export type GetCandidateSearchResponse = GenericResponse<CandidateSearchPaginado>;

// Simplified type for candidate listing
export interface Candidate {
  idUsuario: string;
  nombreCompleto: string;
  ubicacion: string;
  fotografia?: string;
  habilidades: string[];
}
