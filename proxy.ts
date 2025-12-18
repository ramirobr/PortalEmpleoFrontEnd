import { auth } from '@/auth';

type Role = 'Postulante' | 'Administrador Empresa';

const ROLE_RULES: {
  match: (pathname: string) => boolean;
  roles: Role[];
}[] = [
    {
      match: pathname => pathname.startsWith('/profile'),
      roles: ['Postulante'],
    },
    {
      match: pathname => pathname.startsWith('/empleos-busqueda'),
      roles: ['Postulante'],
    },
    {
      match: pathname => pathname.startsWith('/admin'),
      roles: ['Administrador Empresa'],
    },
  ];

export default auth((req) => {
  const { pathname, origin } = req.nextUrl;
  const session = req.auth;
  const rule = ROLE_RULES.find(r => r.match(pathname));
  if (!rule) return;

  if (!session) {
    const loginUrl = new URL('/auth/login', origin);
    loginUrl.searchParams.set('next', pathname);
    return Response.redirect(loginUrl);
  }

  const role = session.user?.role as Role | undefined;
  if (!role || !rule.roles.includes(role)) {
    return Response.redirect(new URL('/', origin));
  }
});

export const config = {
  matcher: [
    '/profile/:path*',
    '/empleos-busqueda/:path*',
    '/admin/:path*',
  ],
};
