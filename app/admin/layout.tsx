"use client";
import Navbar from "@/components/shared/components/Navbar";
import { Children } from "@/types/generic";
import { useEffect, useState } from "react";
import AsideMenu, { NavLink } from "@/components/shared/components/AsideMenu";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { fetchApi } from "@/lib/apiClient";
import { Logout } from "@/types/user";

import { Building2 } from "lucide-react";

export default function AdminLayout({ children }: Children) {
  const { data: session, status } = useSession();
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

  const adminLinks: NavLink[] = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 2H5L4 3v14l1 1h10l1-1V3l-1-1m0 15H5v-3h2a1 1 0 0 0 2 0 1 1 0 0 0-2-1H5v-3h2a1 1 0 0 0 2 0 1 1 0 0 0-2 0H5V7h2a1 1 0 0 0 2-1 1 1 0 0 0-2 0H5V3h10v14zm-8-3 1-1v1H7m0-4h1-1m0-4h1c1 0 0 0 0 0v1L7 6" />
        </svg>
      ),
    },
    {
      name: "Gestionar Empleos",
      href: "/admin/empleos",
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
      name: "Gestionar Empresas",
      href: "/admin/empresas",
      icon: <Building2 />,
    },
    {
      name: "Gestionar Usuarios",
      href: "/admin/usuarios",
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

  // if (status === "loading") {
  //   return <div>Loading...</div>; // Or a spinner
  // }

  // // @ts-ignore
  // if (status === "unauthenticated" || session?.user?.role !== 'admin') {
  //   redirect('/');
  // }

  return (
    <div className="min-h-screen bg-white relative">
      <Navbar onHamburgerClick={toggleAside} isAsideOpen={isAsideOpen} />
      <div className="flex relative">
        <AsideMenu
          isOpen={isAsideOpen}
          onClose={closeAside}
          side="left"
          className="absolute top-0 left-0 h-full w-64 transform-none bg-white shadow-none md:shadow"
          links={adminLinks}
        />
        <main className="w-full flex-1 py-10">
          <div className="container">{children}</div>
        </main>
      </div>
    </div>
  );
}
