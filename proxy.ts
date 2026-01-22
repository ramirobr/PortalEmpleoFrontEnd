import { auth } from "@/auth";
import { ROLES, Roles } from "./types/auth";

const ROLE_RULES: {
  match: (pathname: string) => boolean;
  roles: Roles[];
}[] = [
  {
    match: (pathname) => pathname.startsWith("/profile"),
    roles: [ROLES.Postulante],
  },
  {
    match: (pathname) => pathname.startsWith("/empleos-busqueda"),
    roles: [ROLES.Postulante, ROLES.AdministradorEmpresa],
  },
  //{
  //  match: (pathname) => pathname.startsWith("/empresa-profile"),
  //  roles: [ROLES.AdministradorEmpresa],
  //},
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

  const role = session.user.role;
  if (!role || !rule.roles.includes(role)) {
    return Response.redirect(new URL("/", origin));
  }
});

export const config = {
  matcher: [
    "/profile/:path*",
    "/empleos-busqueda",
    //"/empresa-profile/:path*",
  ],
};
