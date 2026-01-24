import { CatalogTypes } from "@/lib/catalog/fetch";
import { CatalogsByType } from "./search";
import { GenericResponse } from "./user";
import { CatalogFieldsFromTypes } from "./generic";

export const EMPRESA_FORM_FILTERS = [
  "CIUDAD",
  "INDUSTRIA",
  "CANTIDAD_EMPLEADOS",
  "CONDICION_FISCAL",
  "GENERO"
] as const satisfies readonly CatalogTypes[];

export type FormFieldsResponse =
  CatalogFieldsFromTypes<typeof EMPRESA_FORM_FILTERS, CatalogsByType[]>;

export const CANDIDATOS_SEARCH_FILTERS = [
  "PROVINCIA",
  "CIUDAD"
] as const satisfies readonly CatalogTypes[];

export type CandidatosSearchFiltersResponse =
  CatalogFieldsFromTypes<typeof CANDIDATOS_SEARCH_FILTERS, CatalogsByType[]>;

export const CREAR_EMPLEO_FILTERS = [
  "CIUDAD",
  "MODALIDAD_TRABAJO",
  "EXPERIENCIA",
  "NIVEL_ESTUDIO"
] as const satisfies readonly CatalogTypes[];

export type CrearEmpleoFiltersResponse =
  CatalogFieldsFromTypes<typeof CREAR_EMPLEO_FILTERS, CatalogsByType[]>;

export type CompanySignUpData = {
  nombreEmpresa: string,
  razonSocial: string,
  idCondicionFiscal: number,
  documento: string,
  idCiudad: number,
  calle: string,
  numeroCasa: string,
  codigoPostal: string,
  telefono: string,
  idIndustria: number,
  idCantidadEmpleados: number,
  sitioWeb: string,
  nombres: string,
  apellidos: string,
  idGenero?: number,
  email: string,
  password: string,
  aceptaTerminoCondiciones: boolean,
  quieroRecibirNewsLetter: boolean,
  quieroParticiparEncuestas: boolean
}

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

export type GetMisOfertasEmpleoResponse = GenericResponse<MisOfertasEmpleoPaginado>;

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
  };
}

export interface CompanyDashboardInfoData {
  ofertarPublicadas: number;
  candidatosActivos: number;
  postulacionesRecibidas: number;
  aplicantesRecientes: AplicanteReciente[];
}

export type CompanyDashboardInfoResponse = GenericResponse<CompanyDashboardInfoData>

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

export type CompanyProfileResponse = GenericResponse<CompanyProfileData>
