import { auth } from "@/auth";
import { ROLES, Roles } from "./types/auth";

const ROLE_RULES: {
  match: (pathname: string) => boolean;
  allows: (role: Roles) => boolean;
}[] = [
    {
      match: (pathname) => pathname.startsWith("/perfil"),
      allows: (role) => role === ROLES.Postulante,
    },
    {
      match: (pathname) => pathname.startsWith("/empresa-perfil"),
      allows: (role) =>
        role === ROLES.AdministradorEmpresa ||
        role === ROLES.AdministradorDeEmpresa,
    },
    {
      match: (pathname) => pathname.startsWith("/admin"),
      allows: (role) =>
        role !== ROLES.Postulante &&
        role !== ROLES.AdministradorEmpresa &&
        role !== ROLES.AdministradorDeEmpresa,
    },
  ];

export default auth((req) => {
  const { pathname, origin } = req.nextUrl;
  const session = req.auth;
  const rule = ROLE_RULES.find((r) => r.match(pathname));
  if (!rule) return;

  if (!session) {
    const loginUrl = new URL("/auth/login", origin);
    loginUrl.searchParams.set("next", pathname);
    return Response.redirect(loginUrl);
  }

  const roles = session.user.roles?.length ? session.user.roles : [session.user.role];
  if (!roles.some((role) => role && rule.allows(role))) {
    return Response.redirect(new URL("/", origin));
  }
});

export const config = {
  matcher: [
    "/perfil/:path*",
    "/empresa-perfil/:path*",
    "/admin/:path*",
  ],
};
