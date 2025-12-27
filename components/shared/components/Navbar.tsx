"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import UserAvatar from "@/components/shared/components/UserAvatar";
// import SocialLinks from "./SocialLinks";
interface NavbarProps {
  showCompanyRegister?: boolean;
  hideMainMenu?: boolean;
  showBuscarEmpleos?: boolean;
  onHamburgerClick?: () => void;
  isAsideOpen?: boolean;
}

export default function Navbar({
  showCompanyRegister = false,
  hideMainMenu = false,
  showBuscarEmpleos = false,
  onHamburgerClick,
  isAsideOpen = false,
}: NavbarProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isProfileRoute = pathname?.startsWith("/profile");

  return (
    <nav className="relative p-4 flex items-center justify-center shadow-lg">
      <section className="container">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label={session ? "Abrir menú de usuario" : "Abrir menú"}
            aria-pressed={isAsideOpen}
            className={`cursor-pointer ${
              session
                ? `p-0 rounded-full border-none ring-2 ${
                    isAsideOpen ? "ring-green-100" : "ring-primary"
                  } ring-offset-2`
                : "p-2 rounded border border-gray-200 bg-white shadow hover:bg-gray-50"
            } focus:outline-none`}
            onClick={onHamburgerClick}
          >
            {session ? (
              <UserAvatar size={40} />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>

          <Link
            href="/"
            aria-label="Ir a la página principal"
            className="flex items-center"
          >
            <Image
              src="/logos/logo-empresa.jpg"
              alt="Logo de la empresa"
              width={200}
              height={66}
              className=""
              loading="lazy"
            />
          </Link>

          {status !== "loading" && (
            <div
              id="navbar-buttons"
              className="hidden md:flex items-center space-x-2"
            >
              {session ? null : ( // <Button onClick={Logout}>Cerrar sesión</Button>
                <>
                  {!pathname.startsWith("/profile") && (
                    <>
                      <Link
                        href="/auth/signin"
                        className="text-sm btn btn-primary border border-primary px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:z-10"
                      >
                        Crear cuenta
                      </Link>
                      {pathname !== "/auth/login" && (
                        <Link
                          href="/auth/login"
                          className="text-sm btn btn-secondary border border-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:z-10"
                        >
                          Ingresar
                        </Link>
                      )}
                    </>
                  )}
                </>
              )}
              {showCompanyRegister && (
                <Link
                  href="/auth/empresa"
                  aria-label="Regístrate como empresa"
                  className="text-sm btn btn-primary border border-primary px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:z-10"
                >
                  Cuenta empresa
                </Link>
              )}
            </div>
          )}

          {/* <SocialLinks /> */}
        </div>
      </section>
    </nav>
  );
}
