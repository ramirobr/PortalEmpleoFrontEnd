import { GenericResponse, UserInfoData } from "./user";
import { CompanyProfileData } from "./company";

// Admin Empresa interface for the empresas management table
export interface AdminEmpresa {
  idEmpresa: string;
  nombreEmpresa: string;
  numeroDocumento: string;
  fechaRegistro: string;
  ofertasActivas: number;
  plan?: string;
  estado: string;
}

// Paginated response for admin empresas list
export interface AdminEmpresasPaginado {
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  data: AdminEmpresa[];
}

export type GetAdminEmpresasResponse = GenericResponse<AdminEmpresasPaginado>;
export type GetAdminEmpresaResponse = GenericResponse<CompanyProfileData>;

// Parameters for fetching empresas with pagination and filters
export interface AdminEmpresasParams {
  pageSize: number;
  currentPage: number;
  sortBy?: string;
  sortDirection?: string;
  searchQuery?: string;
  idEstado?: number;
  plan?: string;
}

// Update empresa status request
export interface UpdateEmpresaStatusRequest {
  idEmpresa: string;
  nuevoEstado: number; // 1 = Activo, 2 = Suspendido
}

export type UpdateEmpresaStatusResponse = GenericResponse<string>;
export type DeleteEmpresaResponse = GenericResponse<string>;

export interface AdminEmpresaUpdateRequest {
  idEmpresa: string;
  nombre: string;
  razonSocial: string;
  idCondicionFiscal: number;
  numeroDocumento: string;
  idIndustria: number;
  idCantidadEmpleados: number;
  sitioWeb?: string;
  idEstadoEmpresa: number;
  tiempoOperacion?: number;
  certificaciones?: string;
  correoContacto: string;
  telefonoContacto?: string;
  direccion: string;
  idCiudad: number;
  latitud?: number;
  longitud?: number;
  idUsuarioAdministrador?: string;
  nombreAdministrador?: string;
  apellidoAdministrador?: string;
  correoAdministrador?: string;
  telefonoAdministrador?: string;
  telefonoMovilAdministrador?: string;
  idGeneroAdministrador?: number;
}

export type UpdateAdminEmpresaResponse = GenericResponse<string>;

// ===== ADMIN CANDIDATOS =====

// Admin Candidato interface for the candidatos management table
export interface AdminCandidato {
  idUsuario: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  fotoUrl?: string;
  fechaRegistro: string;
  ubicacion: string;
  totalAplicaciones: number;
  estado: {
    id: number;
    nombre: string; // "Activo" | "Suspendido" | "Pendiente"
  };
  perfilCompleto: boolean;
}

// Paginated response for admin candidatos list
export interface AdminCandidatosPaginado {
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  data: AdminCandidato[];
}

export type GetAdminCandidatosResponse =
  GenericResponse<AdminCandidatosPaginado>;
export type GetAdminCandidatoResponse = GenericResponse<UserInfoData>;

// Parameters for fetching candidatos with pagination and filters
export interface AdminCandidatosParams {
  pageSize: number;
  currentPage: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
  estado?: string;
}

export type UpdateCandidatoStatusResponse = GenericResponse<string>;
export type DeleteCandidatoResponse = GenericResponse<string>;

export interface AdminCandidatoUpdateRequest {
  idUsuario: string;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  telefono?: string;
  celular?: string;
  idTipoDocumento: number;
  numeroDocumento: string;
  fechaNacimiento?: string;
  nacionalidad?: string;
  direccion?: string;
  idCiudad?: number;
  idPais?: number;
  idProvincia?: number;
  idEstadoCuenta: number;
  idGenero?: number;
  idEstadoCivil?: number;
  movilidad?: boolean;
  licencia?: boolean;
  tipoLicencia?: string[];
  idTipoJornadaLaboral?: number;
  telefonoReferencia1?: string;
  telefonoReferencia2?: string;
  tieneDiscapacidad?: boolean;
  tipoDiscapacidad?: string;
  porcentajeDiscapacidad?: number;
  planillaServicio?: string;
  documentoAntecedentes?: string;
  documentoIESS?: string;
}

export type UpdateAdminCandidatoResponse = GenericResponse<string>;

// ===== ADMIN EMPLEOS =====

// Admin Empleo interface for the empleos management table
export interface AdminEmpleo {
  idVacante: string;
  tituloPuesto: string;
  ubicacion: string;
  modalidad: string; // "Remoto" | "Presencial" | "Híbrido"
  empresa: string;
  fechaPublicacion: string;
  postulantes: number;
  estado: string; // "Activa" | "Cerrada" | "Pendiente"
}

// Paginated response for admin empleos list
export interface AdminEmpleosPaginado {
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  data: AdminEmpleo[];
}

export type GetAdminEmpleosResponse = GenericResponse<AdminEmpleosPaginado>;

// Parameters for fetching empleos with pagination and filters
export interface AdminEmpleosParams {
  pageSize: number;
  currentPage: number;
  sortBy?: string;
  sortDirection?: string;
  searchQuery?: string;
  idEstado?: number;
}

export type UpdateEmpleoStatusResponse = GenericResponse<string>;
export type DeleteEmpleoResponse = GenericResponse<string>;

// ===== ADMIN TESTIMONIOS =====

// Admin Testimonio interface for the testimonials management table
export interface AdminTestimonio {
  idTestimonio: string;
  candidato: {
    idUsuario: string;
    nombreCompleto: string;
    email: string;
    fotoUrl?: string;
  };
  cargo: string;
  empresa: string;
  testimonioDetalle: string;
  fechaCreacion: string;
  calificacion: number;
  estado: {
    id: number;
    nombre: string; // "Aprobado" | "Pendiente" | "Rechazado"
  };
}

// Paginated response for admin testimonios list
export interface AdminTestimoniosPaginado {
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  data: AdminTestimonio[];
}

export type GetAdminTestimoniosResponse =
  GenericResponse<AdminTestimoniosPaginado>;

// Parameters for fetching testimonios with pagination and filters
export interface AdminTestimoniosParams {
  pageSize: number;
  currentPage: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
  estado?: string;
}

export type UpdateTestimonioStatusResponse = GenericResponse<string>;
export type DeleteTestimonioResponse = GenericResponse<string>;

// ===== ADMIN ROLES =====

// Admin Role interface for the roles management table
export interface AdminRole {
  idRol: string;
  nombre: string;
  descripcion: string;
  permisos: RolePermiso[];
  fechaCreacion: string;
  fechaActualizacion: string;
  usuariosAsignados: number;
  estado: {
    id: number;
    nombre: string; // "Activo" | "Inactivo"
  };
}

// Permission interface for roles
export interface RolePermiso {
  idPermiso: string;
  nombre: string;
  codigo?: string;
  modulo: string;
  descripcion: string;
}

// Paginated response for admin roles list
export interface AdminRolesPaginado {
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  data: AdminRole[];
}

export type GetAdminRolesResponse = GenericResponse<AdminRolesPaginado>;

// Parameters for fetching roles with pagination and filters
export interface AdminRolesParams {
  pageSize: number;
  currentPage: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
  estado?: string;
}

// Create/Update role request
export interface CreateRoleRequest {
  nombre: string;
  descripcion: string;
  permisos: string[]; // Array of permission IDs
}

export interface UpdateRoleRequest extends CreateRoleRequest {
  idRol: string;
}

export type CreateRoleResponse = GenericResponse<AdminRole>;
export type UpdateRoleResponse = GenericResponse<AdminRole>;
export type UpdateRoleStatusResponse = GenericResponse<string>;
export type DeleteRoleResponse = GenericResponse<string>;

// Get all permissions response
export type GetPermisosResponse = GenericResponse<RolePermiso[]>;

export interface UserRolePermissions {
  userId: string;
  userName: string;
  email: string;
  roleId: string;
  roleName: string;
  permisos: RolePermiso[];
}

export type GetUserRolePermissionsResponse = GenericResponse<UserRolePermissions>;

// ===== ADMIN USUARIOS =====

// Admin Usuario interface for the users management table
export interface AdminUsuario {
  idUsuario: string;
  nombreCompleto: string;
  email: string;
  rol: {
    idRol: string;
    nombre: string;
  };
  roles: {
    idRol: string;
    nombre: string;
  }[];
  fechaRegistro: string;
  ultimoAcceso?: string;
  estado: {
    id: number;
    nombre: string; // "Activo" | "Inactivo" | "Suspendido" | "Pendiente"
  };
  tipoUsuario: "candidato" | "empresa" | "admin"; // para filtrar por tipo
}

// Paginated response for admin usuarios list
export interface AdminUsuariosPaginado {
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  data: AdminUsuario[];
}

export type GetAdminUsuariosResponse =
  GenericResponse<AdminUsuariosPaginado>;

// Parameters for fetching usuarios with pagination and filters
export interface AdminUsuariosParams {
  pageSize: number;
  currentPage: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
  estado?: string;
  rol?: string;
  tipoUsuario?: string;
}

export type UpdateUsuarioStatusResponse = GenericResponse<string>;
export type DeleteUsuarioResponse = GenericResponse<string>;

export interface AdminUsuarioCreateRequest {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  idRol: string;
  idRoles?: string[];
  idTipoDocumento: number;
  documento: string;
  idGenero?: number;
  telefono?: string;
}

export type CreateAdminUsuarioResponse = GenericResponse<{
  message: string;
  idUsuario: string;
}>;

export interface AdminUsuarioPasswordRequest {
  idUsuario: string;
  newPassword: string;
  confirmPassword: string;
}

export type UpdateAdminUsuarioPasswordResponse = GenericResponse<{
  message: string;
}>;

// ===== ADMIN CATALOGOS =====

export interface AdminCatalogo {
  idCatalogo: number;
  nombre: string;
  descripcion?: string;
  tipoCatalogo: string;
  codigo?: string;
  valorEntero?: number;
  valorCadena?: string;
  orden: number;
  activo: boolean;
  idCatalogoPadre?: number;
}

export type GetAdminCatalogosResponse = GenericResponse<AdminCatalogo[]>;
export type GetAdminCatalogoByIdResponse = GenericResponse<AdminCatalogo>;
export type CreateCatalogoResponse = GenericResponse<AdminCatalogo>;
export type UpdateCatalogoResponse = GenericResponse<AdminCatalogo>;
export type DeleteCatalogoResponse = GenericResponse<string>;

export interface CatalogoFormValues {
  nombre: string;
  descripcion?: string;
  tipoCatalogo: string;
  codigo?: string;
  valorEntero?: number;
  valorCadena?: string;
  orden: number;
  activo: boolean;
  idCatalogoPadre?: number;
}

// ===== ARCHIVOS =====

export interface TipoArchivo {
  idTipoArchivo: number;
  nombre: string;
  descripcion?: string;
}

export type GetTiposArchivoResponse = GenericResponse<TipoArchivo[]>;

export interface CarpetaEmpresa {
  idCarpetaEmpresa: string;
  idEmpresa: string;
  idCarpetaPadre?: string;
  nombreCarpeta: string;
  descripcion?: string;
  fechaCreacion: string;
}

export interface CarpetaUsuario {
  idCarpetaUsuario: string;
  idUsuario: string;
  idCarpetaPadre?: string;
  nombreCarpeta: string;
  descripcion?: string;
  fechaCreacion: string;
}

export type GetCarpetasEmpresaResponse = GenericResponse<CarpetaEmpresa[]>;
export type GetCarpetasUsuarioResponse = GenericResponse<CarpetaUsuario[]>;

export interface ArchivoEmpresa {
  idArchivoEmpresa: string;
  idEmpresa: string;
  idCarpetaEmpresa?: string;
  nombreArchivo: string;
  extension?: string;
  contentType?: string;
  tamanoBytes?: number;
  fechaCarga: string;
  fechaActualizacion?: string;
  tipoArchivo: string;
}

export interface ArchivoUsuario {
  idArchivoUsuario: string;
  idUsuario: string;
  idCarpetaUsuario?: string;
  nombreArchivo: string;
  extension?: string;
  contentType?: string;
  tamanoBytes?: number;
  fechaCarga: string;
  fechaActualizacion?: string;
  tipoArchivo: string;
}

export type GetArchivosEmpresaResponse = GenericResponse<ArchivoEmpresa[]>;
export type GetArchivosUsuarioResponse = GenericResponse<ArchivoUsuario[]>;

export interface ArchivoDetalleEmpresa {
  idArchivoEmpresa: string;
  nombreArchivo: string;
  extension?: string;
  contentType?: string;
  archivo: string; // base64
  tamanoBytes?: number;
  fechaCarga: string;
}

export interface ArchivoDetalleUsuario {
  idArchivoUsuario: string;
  nombreArchivo: string;
  extension?: string;
  contentType?: string;
  archivo: string; // base64
  tamanoBytes?: number;
  fechaCarga: string;
}

export type GetArchivoDetalleEmpresaResponse =
  GenericResponse<ArchivoDetalleEmpresa>;
export type GetArchivoDetalleUsuarioResponse =
  GenericResponse<ArchivoDetalleUsuario>;

export interface CarpetaFormValues {
  nombreCarpeta: string;
  descripcion?: string;
  idCarpetaPadre?: string;
}

export interface ArchivoUploadFormValues {
  idTipoArchivo: number;
  nombreArchivo: string;
  extension?: string;
  contentType?: string;
  idCarpetaDestino?: string;
  archivoBase64: string;
}

export type ArchivoActionResponse = GenericResponse<unknown>;
