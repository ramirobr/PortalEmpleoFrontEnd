import { auth } from "@/auth";

const PROTECTED = [/* "/profile", */ "/empleos-busqueda"]

export default auth((req) => {
  const session = req.auth;
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.includes(pathname);
  const isAdmin = pathname.startsWith("/admin");

  if (!isProtected && !isAdmin) return;

  if (!session) {
    const newUrl = new URL("/auth/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  const role = session.user?.role;

  if (isProtected && role !== "Postulante") {
    return Response.redirect(new URL("/", req.nextUrl.origin));
  }

  if (isAdmin && role !== "Administrador Empresa") {
    return Response.redirect(new URL("/", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
