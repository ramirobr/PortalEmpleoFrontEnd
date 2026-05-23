export const ROLES = {
  Postulante: "Postulante",
  AdministradorEmpresa: "Administrador Empresa",
  AdministradorDeEmpresa: "Administrador de empresa",
  AdministradorSistema: "Administrador Sistema",
} as const;

export type KnownRole = typeof ROLES[keyof typeof ROLES];
export type Roles = KnownRole | (string & {});
