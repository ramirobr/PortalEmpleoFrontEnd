export const ROLES = {
  Postulante: "Postulante",
  AdministradorEmpresa: "Administrador Empresa",
  AdministradorSistema: "Administrador Sistema",
} as const;

export type Roles = typeof ROLES[keyof typeof ROLES];