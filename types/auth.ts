export const ROLES = {
  Postulante: "Postulante",
  AdministradorEmpresa: "Administrador Empresa",
} as const;

export type Roles = typeof ROLES[keyof typeof ROLES];