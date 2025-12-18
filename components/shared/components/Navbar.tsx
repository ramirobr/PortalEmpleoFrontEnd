"use client";
import Link from "next/link";
import Image from "next/image";
import { getSession, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/lib/apiClient";
import { Logout } from "@/types/user";
import { useEffect } from "react";
// import SocialLinks from "./SocialLinks";
interface NavbarProps {
  showCompanyRegister?: boolean;
  hideMainMenu?: boolean;
  showBuscarEmpleos?: boolean;
}

export default function Navbar({
  showCompanyRegister = false,
  hideMainMenu = false,
  showBuscarEmpleos = false,
}: NavbarProps) {
  const { data: session, status } = useSession();

  useEffect(() => {
    const sync = async () => await getSession();
    sync();
  }, []);

  const Logout = async () => {
    await fetchApi<Logout>("/Authorization/logout", {
      token: session?.user.accessToken,
    });

    await signOut({ redirectTo: "/" });
  };

  return (
    <nav className="p-4 flex justify-between items-center shadow-lg">
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
      {!hideMainMenu && (
        <ul className="flex items-center space-x-4" aria-label="Main menu">
          <li>
            <Link
              href="/"
              aria-label="Ir a ofertas de trabajo"
              className="font-bold uppercase text-primary hover:text-secondary focus:text-secondary px-3 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:z-10"
            >
              JOBS
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              aria-label="Ir al perfil"
              className="font-bold uppercase text-primary hover:text-secondary focus:text-secondary  px-3 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:z-10"
            >
              PROFILE
            </Link>
          </li>
        </ul>
      )}
      <div>
        {status !== "loading" && (
          <div className="flex items-center space-x-2">
            {session ? (
              <Button onClick={Logout}>Cerrar sesión</Button>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="btn btn-primary border border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:z-10"
                >
                  Crear cuenta
                </Link>
                <Link
                  href="/auth/login"
                  className="btn btn-secondary border border-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:z-10"
                >
                  Ingresar
                </Link>
              </>
            )}
            {showCompanyRegister && (
              <Link
                href="/auth/empresa"
                aria-label="Regístrate como empresa"
                className="btn btn-primary border border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:z-10"
              >
                Regístrate como empresa
              </Link>
            )}
            {showBuscarEmpleos && (
              <Link
                href="/empleos-busqueda"
                aria-label="Buscar empleos"
                className="btn btn-primary border border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:z-10"
              >
                Buscar empleos
              </Link>
            )}
          </div>
        )}
      </div>
      {/* <SocialLinks /> */}
    </nav>
  );
}
