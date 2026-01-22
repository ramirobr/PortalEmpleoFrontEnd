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

  const authLinks: NavLink[] = [
    { name: "Ingresar", href: "/auth/login", icon: <LockKeyholeOpen /> },
    { name: "Crear cuenta", href: "/auth/email", icon: <UserRoundPlus /> },
    {
      name: "Regístrate como empresa",
      href: "/auth/empresa",
      icon: <Building2 />,
    },
  ];

  const userLinks: NavLink[] = [
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
      name: "Mi Perfil",
      href: "/profile",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
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
