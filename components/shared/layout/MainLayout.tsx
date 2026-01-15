"use client";

import { useState } from "react";
import Navbar from "@/components/shared/components/Navbar";

import AsideMenu from "@/components/shared/components/AsideMenu";
import { Children } from "@/types/generic";
import { useSession } from "next-auth/react";

export default function MainLayout({ children }: Children) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar
        onHamburgerClick={toggleMobileMenu}
        isAsideOpen={isMobileMenuOpen}
        showCompanyRegister
      />
      <AsideMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        side="left"
        className="w-1/2 max-w-sm"
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
