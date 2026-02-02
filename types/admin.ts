import { GenericResponse } from "./user";

// Admin Empresa interface for the empresas management table
export interface AdminEmpresa {
  idEmpresa: string;
  nombreEmpresa: string;
  rut: string;
  logoUrl?: string;
  fechaRegistro: string;
  ofertasActivas: number;
  plan: {
    id: number;
    nombre: string; // "Premium" | "Básico"
  };
  estado: {
    id: number;
    nombre: string; // "Activo" | "Suspendido"
  };
}

// Paginated response for admin empresas list
export interface AdminEmpresasPaginado {
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  data: AdminEmpresa[];
}

export type GetAdminEmpresasResponse = GenericResponse<AdminEmpresasPaginado>;

// Parameters for fetching empresas with pagination and filters
export interface AdminEmpresasParams {
  pageSize: number;
  currentPage: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
  estado?: string;
  plan?: string;
}

// Update empresa status request
export interface UpdateEmpresaStatusRequest {
  idEmpresa: string;
  nuevoEstado: number; // 1 = Activo, 2 = Suspendido
}

export type UpdateEmpresaStatusResponse = GenericResponse<string>;
export type DeleteEmpresaResponse = GenericResponse<string>;

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

// ===== ADMIN EMPLEOS =====

// Admin Empleo interface for the empleos management table
export interface AdminEmpleo {
  idVacante: string;
  titulo: string;
  empresa: {
    nombre: string;
    logoUrl?: string; // Optional if available
  };
  fechaPublicacion: string;
  ubicacion: string; // Ciudad, Pais or just text
  postulantes: number;
  estado: {
    id: number;
    nombre: string; // "Activo" | "Cerrado" | "Pendiente"
  };
  modalidad: string; // "Remoto" | "Presencial" | "Híbrido"
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
  sortDirection?: "asc" | "desc";
  search?: string;
  estado?: string;
  empresa?: string; // Filter by specific empresa if needed
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
