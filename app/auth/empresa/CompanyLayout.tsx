"use client";

import { useState } from "react";
import Navbar from "../../../components/shared/components/Navbar";
import AsideMenu from "../../../components/shared/components/AsideMenu";

type CompanyLayoutProps = {
  children: React.ReactNode;
};

export default function CompanyLayout({ children }: CompanyLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
      />
      {children}
    </>
  );
}
