"use client";

import { useState } from "react";
import Navbar from "../../../components/shared/components/Navbar";
import AsideMenu from "../../../components/shared/components/AsideMenu";

type EmailLayoutProps = {
  children: React.ReactNode;
};

export default function EmailLayout({ children }: EmailLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
      />
      {children}
    </>
  );
}
