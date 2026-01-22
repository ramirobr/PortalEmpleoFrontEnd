"use client";

import { useState } from "react";
import Navbar from "../../../components/shared/components/Navbar";
import AsideMenu, {
  NavLink,
} from "../../../components/shared/components/AsideMenu";

type CompanyLayoutProps = {
  children: React.ReactNode;
};

import { LockKeyholeOpen, UserRoundPlus, Building2 } from "lucide-react";

export default function CompanyLayout({ children }: CompanyLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const authLinks: NavLink[] = [
    {
      name: "Ingresar",
      href: "/auth/login",
      icon: <LockKeyholeOpen />,
    },
    {
      name: "Crear cuenta",
      href: "/auth/email",
      icon: <UserRoundPlus />,
    },
    {
      name: "Regístrate como empresa",
      href: "/auth/empresa",
      icon: <Building2 />,
    },
  ];

  return (
    <>
      <Navbar
        showCompanyRegister={false}
        onHamburgerClick={toggleMobileMenu}
        isAsideOpen={isMobileMenuOpen}
      />
      <AsideMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        side="left"
        className="w-1/2 max-w-sm"
        links={authLinks}
      />
      {children}
    </>
  );
}
