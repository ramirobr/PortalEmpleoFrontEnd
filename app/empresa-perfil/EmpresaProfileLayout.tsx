"use client";
import Navbar from "@/components/shared/components/Navbar";
import { Children } from "@/types/generic";
import { useEffect, useState } from "react";
import AsideMenu, { NavLink } from "@/components/shared/components/AsideMenu";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { fetchApi } from "@/lib/apiClient";
import { Logout } from "@/types/user";

import {
  LockKeyholeOpen,
  UserRoundPlus,
  Building2,
  Building,
  KeyRound,
  Search,
  FolderOpen,
} from "lucide-react";
import { getAuthLinks, getEmpresaLinks } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export default function EmpresaProfileLayout({ children }: Children) {
  const { data: session } = useSession();
  const pathname = usePathname();
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

  const authLinks = getAuthLinks();
  const empresaLinks = getEmpresaLinks(handleLogout);

  return (
    <div className="min-h-screen bg-white relative">
      <Navbar
        onHamburgerClick={toggleAside}
        isAsideOpen={isAsideOpen}
        logoHref="/empresa-perfil"
        navLinks={[
          { label: "Inicio", href: "/empresa-perfil" },
          { label: "Candidatos", href: "/empresa-perfil/buscar-candidatos" },
          { label: "Contrataciones", href: "/empresa-perfil/postulaciones" },
        ]}
        profileButtonLabel="Mi Empresa"
      />
      <div className="flex relative">
        <AsideMenu
          isOpen={isAsideOpen}
          onClose={closeAside}
          side="left"
          className="absolute top-0 left-0 h-full w-80 transform-none bg-surface-dark shadow-none lg:shadow"
          links={session ? empresaLinks : authLinks}
        />
        <main
          className={cn(
            "w-full py-10 bg-zinc-50",
            pathname === "/empresa-perfil" && "pt-0 lg:pt-0",
            pathname === "/empresa-perfil/empleos" && "pt-5 lg:pt-10",
            pathname === "/empresa-perfil/buscar-candidatos" && "pt-0 lg:pt-0 py-0 pb-10",
          )}
        >
          {pathname === "/empresa-perfil/buscar-candidatos" ? (
            children
          ) : (
            <div className="container shrink-0">{children}</div>
          )}
        </main>
      </div>
    </div>
  );
}
