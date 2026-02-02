"use client";
import Navbar from "@/components/shared/components/Navbar";
import { Children } from "@/types/generic";
import { useEffect, useState } from "react";
import AsideMenu, { NavLink } from "@/components/shared/components/AsideMenu";
import { useSession, signOut } from "next-auth/react";
import { fetchApi } from "@/lib/apiClient";
import { Logout } from "@/types/user";

import { LockKeyholeOpen, UserRoundPlus, Building2, Building, KeyRound } from "lucide-react";

export default function EmpresaProfileLayout({ children }: Children) {
  const { data: session } = useSession();
  const [isAsideOpen, setIsAsideOpen] = useState(false);

  const toggleAside = () => setIsAsideOpen((prev) => !prev);
  const closeAside = () => setIsAsideOpen(false);

  useEffect(() => {
    document.body.style.overflow = isAsideOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAsideOpen]);

  const handleLogout = async () => {
    if (session?.user?.accessToken) {
      await fetchApi<Logout>("/Authorization/logout", {
        token: session.user.accessToken,
      });
    }
    await signOut({ redirectTo: "/" });
  };

  const empresaLinks: NavLink[] = [
    {
      name: "Panel de Empresa",
      href: "/empresa-profile",
      icon: <Building2 />,
    },
    {
      name: "Perfil de Empresa",
      href: "/empresa-profile/perfil",
      icon: <Building />,
    },
    {
      name: "Publicar Empleo",
      href: "/empresa-profile/crear-empleo",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </svg>
      ),
    },
    {
      name: "Mis Ofertas",
      href: "/empresa-profile/empleos",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
        </svg>
      ),
    },
    {
      name: "Postulaciones",
      href: "/empresa-profile/postulaciones",
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
      name: "Cambiar contraseña",
      href: "/empresa-profile/cambiar-contrasena",
      icon: <KeyRound className="w-5 h-5" />,
    },
    {
      name: "Salir",
      onClick: handleLogout,
      className: "text-red-700",
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
  ];

  const authLinks: NavLink[] = [
    { name: "Ingresar", href: "/auth/login", icon: <LockKeyholeOpen /> },
    { name: "Crear cuenta", href: "/auth/email", icon: <UserRoundPlus /> },
  ];

  return (
    <div className="min-h-screen bg-white relative">
      <Navbar onHamburgerClick={toggleAside} isAsideOpen={isAsideOpen} />
      <div className="flex relative">
        <AsideMenu
          isOpen={isAsideOpen}
          onClose={closeAside}
          side="left"
          className="absolute top-0 left-0 h-full w-64 transform-none bg-white shadow-none md:shadow"
          links={session ? empresaLinks : authLinks}
        />
        <main className="w-full flex-1 py-10">
          <div className="container">{children}</div>
        </main>
      </div>
    </div>
  );
}
