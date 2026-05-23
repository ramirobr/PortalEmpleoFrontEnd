"use client";
import Navbar from "@/components/shared/components/Navbar";
import Footer from "@/components/shared/components/Footer";
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
  MessageSquareQuote,
  KeyRound,
  ThumbsUp,
  FolderOpen,
} from "lucide-react";
import { getAuthLinks, getUserLinks } from "@/lib/navigation";

export default function ProfileLayout({ children }: Children) {
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
  const profileLinks = getUserLinks(handleLogout);

  return (
    <div className="min-h-screen bg-white relative">
      <Navbar
        onHamburgerClick={toggleAside}
        isAsideOpen={isAsideOpen}
        logoHref="/perfil"
        navLinks={[
          { label: "Inicio", href: "/perfil" },
          { label: "Ofertas", href: "/empleos-busqueda" },
        ]}
      />
      <div className="relative bg-zinc-50">
        <AsideMenu
          isOpen={isAsideOpen}
          onClose={closeAside}
          side="left"
          className="absolute top-0 left-0 h-full w-80 transform-none bg-surface-dark shadow-none lg:shadow"
          links={session ? profileLinks : authLinks}
        />
        <main
          className={`w-full flex-1 py-10 flex flex-col justify-between ${
            pathname === "/perfil" ? "pt-0" : ""
          }`}
        >
          <div className="container mb-auto">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
