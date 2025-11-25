import { auth } from "@/auth";

export default auth((req) => {
  const session = req.auth;
  const { pathname } = req.nextUrl;

  const isProfile = pathname.startsWith("/profile");
  const isAdmin = pathname.startsWith("/admin");

  if (!isProfile && !isAdmin) {
    return;
  }

  // BYPASS TEMPORAL: Permitir acceso libre a /profile durante desarrollo
  if (!session && isProfile) {
    // No redirigir, permitir acceso
    return;
  }
  if (!session) {
    const newUrl = new URL("/auth/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  const role = session.user?.role;

  if (isProfile && role !== "Postulante") {
    return Response.redirect(new URL("/", req.nextUrl.origin));
  }

  if (isAdmin && role !== "Administrador Empresa") {
    return Response.redirect(new URL("/", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
