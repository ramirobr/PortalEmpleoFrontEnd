"use client";

import { useState } from "react";
import Navbar from "../../../components/shared/components/Navbar";
import AsideMenu, {
  NavLink,
} from "../../../components/shared/components/AsideMenu";
import { useSession, signOut } from "next-auth/react";
import { fetchApi } from "@/lib/apiClient";
import { Logout } from "@/types/user";

import { LockKeyholeOpen, UserRoundPlus, Building2 } from "lucide-react";
import { getAuthLinks, getUserLinks } from "@/lib/navigation";

type EmailLayoutProps = {
  children: React.ReactNode;
};

export default function EmailLayout({ children }: EmailLayoutProps) {
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

  return (
    <>
      <Navbar
        showCompanyRegister
        onHamburgerClick={toggleMobileMenu}
        isAsideOpen={isMobileMenuOpen}
      />
      <AsideMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        side="left"
        className="w-1/2 max-w-sm"
        links={session ? userLinks : authLinks}
      />
      {children}
    </>
  );
}
