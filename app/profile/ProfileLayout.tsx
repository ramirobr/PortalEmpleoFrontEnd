"use client";
import Navbar from "@/components/shared/components/Navbar";
import Footer from "@/components/shared/components/Footer";
import { Children } from "@/types/generic";
import { useEffect, useState } from "react";
import AsideMenu, { NavLink } from "@/components/shared/components/AsideMenu";
import { useSession, signOut } from "next-auth/react";
import { fetchApi } from "@/lib/apiClient";
import { Logout } from "@/types/user";

import {
  LockKeyholeOpen,
  UserRoundPlus,
  Building2,
  MessageSquareQuote,
  KeyRound,
} from "lucide-react";

export default function ProfileLayout({ children }: Children) {
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

  const profileLinks: NavLink[] = [
    {
      name: "Inicio",
      href: "/",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M6 19h3v-5q0-.425.288-.712T10 13h4q.425 0 .713.288T15 14v5h3v-9l-6-4.5L6 10zm-2 0v-9q0-.475.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-4q-.425 0-.712-.288T13 20v-5h-2v5q0 .425-.288.713T10 21H6q-.825 0-1.412-.587T4 19m8-6.75"
          />
        </svg>
      ),
    },
    {
      name: "Dashboard",
      href: "/profile",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 2H5L4 3v14l1 1h10l1-1V3l-1-1m0 15H5v-3h2a1 1 0 0 0 2 0 1 1 0 0 0-2-1H5v-3h2a1 1 0 0 0 2 0 1 1 0 0 0-2 0H5V7h2a1 1 0 0 0 2-1 1 1 0 0 0-2 0H5V3h10v14zm-8-3 1-1v1H7m0-4h1-1m0-4h1c1 0 0 0 0 0v1L7 6" />
        </svg>
      ),
    },
    {
      name: "Editar Perfil",
      href: "/profile/edit",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
        </svg>
      ),
    },
    {
      name: "Buscar Empleos",
      href: "/empleos-busqueda",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      ),
    },
    {
      name: "Empleos favoritos",
      href: "/profile/favoritos",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.071 13.142 13.414 18.8a2 2 0 0 1-2.828 0l-5.657-5.657A5 5 0 1 1 12 6.072a5 5 0 0 1 7.071 7.07"
          />
        </svg>
      ),
    },
    {
      name: "Mis Testimonios",
      href: "/profile/testimonios",
      icon: <MessageSquareQuote />,
    },
    {
      name: "Cambiar contraseña",
      href: "/profile/cambiar-contrasena",
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
    {
      name: "Regístrate como empresa",
      href: "/auth/empresa",
      icon: <Building2 />,
    },
  ];

  return (
    <div className="min-h-screen bg-white relative">
      <Navbar onHamburgerClick={toggleAside} isAsideOpen={isAsideOpen} />
      <div className="relative bg-gray-50">
        <AsideMenu
          isOpen={isAsideOpen}
          onClose={closeAside}
          side="left"
          className="absolute top-0 left-0 h-full w-80 transform-none bg-white shadow-none md:shadow"
          links={session ? profileLinks : authLinks}
        />
        <main className="w-full flex-1 py-10 flex flex-col justify-between">
          <div className="container mb-auto">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
