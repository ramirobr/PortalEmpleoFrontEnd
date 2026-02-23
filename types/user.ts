import { CatalogTypes } from "@/lib/catalog/fetch";
import { CatalogFieldsFromTypes } from "./generic";
import { CatalogsByType } from "./search";
import { Roles } from "./auth";

export type SignupData = {
  nombres: string;
  apellidos: string;
  idTipoDocumento: number;
  documento: string;
  telefono: string;
  telefonoMobil: string;
  fechaNacimiento: string;
  email: string;
  password: string;
  aceptaCondicionesUso: boolean;
  aceptaPoliticaPrivacidad: boolean;
  aceptaNotificaciones: boolean;
};

export type GenericResponse<T> = {
  code: number;
  messages: string[];
  isSuccess: boolean;
  data: T;
};

export type PlainStringDataMessage = GenericResponse<string>;
export type LoginResponse = GenericResponse<LoginData>;

export type LoginData = {
  userId: string;
  fullName: string;
  role: Roles;
  email: string;
  token: string;
  tokenExpireIn: Date;
  refreshToken: string;
  idEmpresa?: string;
};

export type UserAuthData = Omit<
  LoginData,
  "accessToken" | "token" | "tokenExpireIn"
>;
export type RefreshToken = GenericResponse<RefreshTokenData>;

export type RefreshTokenData = {
  accessToken: string;
  refreshToken: string;
};

export type Logout = GenericResponse<null>;

export const DATOS_PERSONALES_TYPES = [
  "PAIS",
  "CIUDAD",
  "PROVINCIA",
  "TIPO_EMPLEO",
  "TIPO_DOCUMENTO",
  "EXPERIENCIA",
  "CATEGORIA_HABILIDAD",
  "NIVEL_ESTUDIO",
  "DISPONIBILIDAD",
  "GENERO",
  "ESTADO_CIVIL",
  "NIVEL_IDIOMA",
] as const satisfies readonly CatalogTypes[];

export type DatosPersonalesFieldsResponse = CatalogFieldsFromTypes<
  typeof DATOS_PERSONALES_TYPES,
  CatalogsByType[]
>;

export interface Notificacion {
  idNotificacion: string;
  descripcion: string;
  fechaCreacion: string;
  esLeida: boolean;
}

export interface DashboardInfoData {
  userName: string;
  userEmail: string;
  userRole: string;
  ubicacion: string;
  totalApplications: number;
  revision: number;
  elegido: number;
  visitas: number;
  tieneCurriculumPrincipal: boolean;
  totalEducaciones: number;
  totalExperiencias: number;
  totalHabilidades: number;
  totalIdiomas: number;
  totalCertificaciones: number;
  resumenProfesional: string;
  disponibilidad: string;
  listaTrabajosAplicados: ListaTrabajosAplicado[];
  notificaciones: Notificacion[];
}

export interface ListaTrabajosAplicado {
  id: number;
  estado: string;
  fechaAplicacion: string;
  titulo: string;
  empresa: string;
}

export type DashboardInfoResponse = GenericResponse<DashboardInfoData>;

export interface UserInfoData {
  userId: string;
  estadoCuenta: string;
  idEstadoCuenta: number;
  fechaRegistro: string;
  ultimoAcceso: string;
  datosPersonales: DatosPersonales;
  datosContacto: DatosContacto;
  educacion: Educacion[];
  experienciaLaboral: ExperienciaLaboral[];
  habiliades: Habilidades[];
  idiomas: Idioma[];
  // Added fields based on Public Profile usage
  resumen?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  availabilityStatus?: string;
  profilePictureUrl?: string;
  name?: string; // Legacy/Flat support
  lastName?: string; // Legacy/Flat support
  jobTitle?: string;
  city?: string;
  country?: string;
}

export interface DatosPersonales {
  nombre: string;
  apellido: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  nacionalidad: string;
  idTipoDocumento: number;
  idTipoUsuario: number;
  idGenero: number;
  genero: string;
  movilidad: boolean;
  licencia: boolean;
  tipoLicencia: Array<string>;
  idEstadoCivil: number;
}

export interface DatosContacto {
  email: string;
  telefono: string;
  celular: string;
  direccion: string;
  ciudad: string;
  pais: string;
  provincia: string;
  idCiudad: number;
  idPais: number;
  idProvincia: number;
}

export interface Educacion {
  id: string;
  titulo: string;
  institucion: string;
  fechaInicio: string;
  fechaFin: string;
  estaCursando: boolean;
  periodo: string;
  idNivelEstudio: number;
  descripcion: string;
  orden: number;
}

export type EducacionData = {
  idEducacion: string;
  idCurriculum: string;
  idNivelEstudio: number;
  descripcion: string;
} & Omit<Educacion, "id">;

export type EducacionResponse = GenericResponse<EducacionData>;

export interface ExperienciaLaboral {
  id: string;
  puesto: string;
  empresa: string;
  fechaInicio: string;
  fechaFin: string;
  estaTrabajando: boolean;
  descripcion: string;
  idPais: number;
  idCiudad: number;
  pais: string;
  sector: string;
  idTipoEmpleo: number;
  orden: number;
}

export type ExperienciaLaboralData = {
  idExperiencia: string;
  trabajoActual: boolean;
  orden: number;
} & Omit<ExperienciaLaboral, "id" | "estaTrabajando"> &
  Pick<EducacionData, "orden" | "idCurriculum">;

export type ExperienciaLaboralResponse =
  GenericResponse<ExperienciaLaboralData>;

export interface Habilidades {
  id: string;
  nombre: string;
  idNivel: number;
  nivel: string;
  idCategoria: number;
  categoria: string;
  orden: number;
}

export interface Idioma {
  id: string;
  nombre: string;
  idNivel: number;
  nivel: string;
  certificado: boolean;
  certificacion: string;
}

export type IdiomaData = {
  idIdioma: string;
  idNivelIdioma: number;
} & Pick<Idioma, "nombre"> &
  Pick<EducacionData, "orden" | "idCurriculum">;

export type IdiomaResponse = GenericResponse<IdiomaData>;

export type UserInfoResponse = GenericResponse<UserInfoData>;

export interface Curriculum {
  idCurriculum: string;
  resumenProfesional: string;
  idDisponibilidad: number;
  disponibilidadNombre: string;
  fechaCarga: string;
  fechaActualizacion: string;
  esPrincipal: boolean;
  tieneCurriculum: boolean;
}

export type CurriculumResponse = GenericResponse<Curriculum>;

export type HabilidadData = {
  idHabilidad: string;
  idCategoriaHabilidad: number;
  idNivelExperiencia: number;
  aniosExperiencia: number;
} & Pick<Habilidades, "nombre"> &
  Pick<EducacionData, "orden" | "idCurriculum">;

export type HabilidadesResponse = GenericResponse<HabilidadData>;

export const SIGN_UP_FIELDS = [
  "TIPO_DOCUMENTO",
  "GENERO",
] as const satisfies readonly CatalogTypes[];

export type SignUpFieldsResponse = CatalogFieldsFromTypes<
  typeof SIGN_UP_FIELDS,
  CatalogsByType[]
>;
