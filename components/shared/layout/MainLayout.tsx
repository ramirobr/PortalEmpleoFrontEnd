"use client";
import { useState } from "react";
import Navbar from "@/components/shared/components/Navbar";
import AsideMenu, { NavLink } from "@/components/shared/components/AsideMenu";
import { Children } from "@/types/generic";
import { useSession, signOut } from "next-auth/react";
import { ROLES } from "@/types/auth";
import { fetchApi } from "@/lib/apiClient";
import { Logout } from "@/types/user";

import { LockKeyholeOpen, UserRoundPlus, Building2 } from "lucide-react";
import { getAuthLinks, getUserLinks, getEmpresaLinks } from "@/lib/navigation";

export default function MainLayout({ children }: Children) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    if (session?.user?.accessToken) {
      await fetchApi<Logout>("/Authorization/logout", {
        token: session.user.accessToken,
      });
    }
    await signOut({ redirectTo: "/" });
  };

  const authLinks = getAuthLinks();
  const userLinks = getUserLinks(handleLogout);
  const empresaLinks = getEmpresaLinks(handleLogout);

  let links: NavLink[];

  if (!session) {
    links = authLinks;
  } else if (session.user.role === ROLES.AdministradorEmpresa) {
    links = empresaLinks;
  } else {
    links = userLinks;
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar
        onHamburgerClick={toggleMobileMenu}
        isAsideOpen={isMobileMenuOpen}
        showCompanyRegister={!session}
      />

      <AsideMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        side="left"
        className="w-1/2 max-w-sm"
        links={links}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
