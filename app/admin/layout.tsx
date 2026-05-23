"use client";

import AsideMenu, { NavLink } from "@/components/shared/components/AsideMenu";
import Navbar from "@/components/shared/components/Navbar";
import { fetchApi } from "@/lib/apiClient";
import { getUserRolePermissions } from "@/lib/admin/adminPermissions";
import { ROLES } from "@/types/auth";
import { Children } from "@/types/generic";
import { Logout } from "@/types/user";
import {
  BookOpen,
  Briefcase,
  Building2,
  FileText,
  FolderOpen,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Shield,
  Users,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type AdminNavLink = NavLink & {
  permissionCodes?: string[];
  alwaysVisible?: boolean;
};

function isAdminRole(role?: string) {
  return (
    !!role &&
    role !== ROLES.Postulante &&
    role !== ROLES.AdministradorEmpresa &&
    role !== ROLES.AdministradorDeEmpresa
  );
}

function hasAdminRole(roles?: string[]) {
  return !!roles?.some(isAdminRole);
}

export default function AdminLayout({ children }: Children) {
  const { data: session, status } = useSession();
  const { push } = useRouter();
  const pathname = usePathname();
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [permissionCodes, setPermissionCodes] = useState<Set<string> | null>(null);
  const userRoles = useMemo(
    () =>
      session?.user?.roles?.length
        ? session.user.roles
        : session?.user?.role
          ? [session.user.role]
          : [],
    [session?.user?.role, session?.user?.roles],
  );
  const hasAdminAccess = hasAdminRole(userRoles);

  const toggleAside = () => setIsAsideOpen((prev) => !prev);
  const closeAside = () => setIsAsideOpen(false);

  useEffect(() => {
    document.body.style.overflow = isAsideOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAsideOpen]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      push(`/auth/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (hasAdminAccess) return;

    if (userRoles.includes(ROLES.Postulante)) {
      push("/perfil");
      return;
    }

    if (
      userRoles.includes(ROLES.AdministradorEmpresa) ||
      userRoles.includes(ROLES.AdministradorDeEmpresa)
    ) {
      push("/empresa-perfil");
    }
  }, [hasAdminAccess, pathname, push, session, status, userRoles]);

  useEffect(() => {
    if (!hasAdminAccess || !session?.user?.id || !session.user.accessToken) {
      return;
    }

    let isMounted = true;

    getUserRolePermissions(session.user.id, session.user.accessToken).then((response) => {
      if (!isMounted) return;

      const codes = response?.isSuccess
        ? response.data.permisos
            .map((permiso) => permiso.codigo)
            .filter((codigo): codigo is string => !!codigo)
        : [];

      setPermissionCodes(new Set(codes));
    });

    return () => {
      isMounted = false;
    };
  }, [hasAdminAccess, session?.user?.accessToken, session?.user?.id]);

  const handleLogout = useCallback(async () => {
    if (session?.user?.accessToken) {
      await fetchApi<Logout>("/Authorization/logout", {
        token: session.user.accessToken,
      });
    }
    await signOut({ redirectTo: "/" });
  }, [session?.user?.accessToken]);

  const adminNavigation: AdminNavLink[] = useMemo(() => [
    {
      name: "Dashboard",
      href: "/admin",
      permissionCodes: ["ADMIN_DASHBOARD_VIEW"],
      icon: <LayoutDashboard />,
    },
    {
      name: "Gestionar Empleos",
      href: "/admin/empleos",
      permissionCodes: ["ADMIN_EMPLEOS_VIEW"],
      icon: <Briefcase />,
    },
    {
      name: "Gestionar Empresas",
      href: "/admin/empresas",
      permissionCodes: ["ADMIN_EMPRESAS_VIEW"],
      icon: <Building2 />,
    },
    {
      name: "Gestionar Candidatos",
      href: "/admin/candidatos",
      permissionCodes: ["ADMIN_CANDIDATOS_VIEW"],
      icon: <Users />,
    },
    {
      name: "Gestionar Testimonios",
      href: "/admin/testimonios",
      permissionCodes: ["ADMIN_TESTIMONIOS_VIEW"],
      icon: <MessageSquare />,
    },
    {
      name: "Gestionar Roles",
      href: "/admin/roles",
      permissionCodes: ["ADMIN_ROLES_VIEW"],
      icon: <Shield />,
    },
    {
      name: "Gestionar Catalogos",
      href: "/admin/catalogos",
      permissionCodes: ["ADMIN_CATALOGOS_VIEW"],
      icon: <BookOpen />,
    },
    {
      name: "Archivos Empresas",
      href: "/admin/archivos-empresa",
      permissionCodes: ["ADMIN_ARCHIVOS_EMPRESA_MANAGE"],
      icon: <FolderOpen />,
    },
    {
      name: "Archivos Candidatos",
      href: "/admin/archivos-candidato",
      permissionCodes: ["ADMIN_ARCHIVOS_CANDIDATO_MANAGE"],
      icon: <FileText />,
    },
    {
      name: "Gestionar Usuarios",
      href: "/admin/usuarios",
      permissionCodes: ["ADMIN_USUARIOS_VIEW"],
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      ),
    },
    {
      name: "Gestionar Blogs",
      href: "/admin/blogs",
      permissionCodes: ["ADMIN_BLOGS_VIEW"],
      icon: <Newspaper />,
    },
    {
      name: "Salir",
      onClick: handleLogout,
      alwaysVisible: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 4.001H5v14a2 2 0 0 0 2 2h8m1-5 3-3m0 0-3-3m3 3H9"
          />
        </svg>
      ),
    },
  ], [handleLogout]);

  const adminLinks: NavLink[] = adminNavigation
    .filter((link) => {
      if (link.alwaysVisible) return true;
      if (!link.permissionCodes?.length) return true;
      if (!permissionCodes) return false;
      return link.permissionCodes.some((code) => permissionCodes.has(code));
    })
    .map((link) => ({
      name: link.name,
      href: link.href,
      icon: link.icon,
      id: link.id,
      onClick: link.onClick,
      className: link.className,
    }));

  useEffect(() => {
    if (!hasAdminAccess || !permissionCodes) return;

    const routeLinks = adminNavigation.filter(
      (link) => link.href && !link.alwaysVisible,
    );
    const currentRoute = routeLinks
      .slice()
      .sort((a, b) => (b.href?.length ?? 0) - (a.href?.length ?? 0))
      .find((link) =>
        link.href === "/admin"
          ? pathname === "/admin"
          : pathname === link.href || pathname.startsWith(`${link.href}/`),
      );

    if (
      currentRoute?.permissionCodes?.length &&
      !currentRoute.permissionCodes.some((code) => permissionCodes.has(code))
    ) {
      const firstAllowed = routeLinks.find((link) =>
        link.permissionCodes?.some((code) => permissionCodes.has(code)),
      );

      if (firstAllowed?.href && firstAllowed.href !== pathname) {
        push(firstAllowed.href);
      }
    }
  }, [adminNavigation, hasAdminAccess, pathname, permissionCodes, push]);

  return (
    <div className="min-h-screen bg-white relative">
      <Navbar
        onHamburgerClick={toggleAside}
        isAsideOpen={isAsideOpen}
        profileButtonLabel="Admin"
      />
      <div className="flex relative bg-zinc-50">
        <AsideMenu
          isOpen
          onClose={closeAside}
          side="left"
          persistent
          className="w-80 shrink-0 bg-surface-dark shadow-none lg:shadow"
          links={adminLinks}
        />
        <main className="w-full min-w-0 py-10 bg-zinc-50 lg:py-20">
          <div className="container">{children}</div>
        </main>
      </div>
    </div>
  );
}
