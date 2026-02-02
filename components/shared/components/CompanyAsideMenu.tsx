import { fetchApi } from "@/lib/apiClient";
import { Logout } from "@/types/user";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type CompanyAsideMenuProps = {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
  side?: "left" | "right";
};

import { LockKeyholeOpen, UserRoundPlus, Building2 } from "lucide-react";

export default function CompanyAsideMenu({
  isOpen = false,
  onClose,
  className = "w-1/2 max-w-sm",
  side = "right",
}: CompanyAsideMenuProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Prevent scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    if (session?.user?.accessToken) {
      await fetchApi<Logout>("/Authorization/logout", {
        token: session.user.accessToken,
      });
    }
    await signOut({ redirectTo: "/" });
  };

  const getLinkClass = (path: string) => {
    let isActive = false;

    if (path === "/") {
      isActive = pathname === "/";
    } else if (path === "/empresa-profile" || path === "/empresa-profile/") {
      isActive =
        pathname === "/empresa-profile" || pathname === "/empresa-profile/";
    } else {
      isActive = pathname.startsWith(path);
    }

    return isActive
      ? "bg-blue-50 rounded px-5 py-2 font-semibold text-primary flex items-center"
      : "px-5 py-2 cursor-pointer hover:bg-gray-100 rounded flex items-center";
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-60 flex h-full flex-col bg-white shadow-lg transition-transform duration-300 transform ${
          isOpen
            ? "translate-x-0"
            : side === "left"
              ? "-translate-x-full"
              : "translate-x-[100vw]"
        } ${className}`}
      >
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 focus:outline-none ring-2 ring-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="flex flex-col items-center py-15  h-full mt-5">
          <nav className="flex-1 w-full">
            <ul className="space-y-2">
              <li id="Home" className={getLinkClass("/")}>
                <Link
                  href="/"
                  className="flex items-center w-full h-full"
                  onClick={onClose}
                >
                  <svg
                    className="h-[37px] w-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M6 19h3v-5q0-.425.288-.712T10 13h4q.425 0 .713.288T15 14v5h3v-9l-6-4.5L6 10zm-2 0v-9q0-.475.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-4q-.425 0-.712-.288T13 20v-5h-2v5q0 .425-.288.713T10 21H6q-.825 0-1.412-.587T4 19m8-6.75"
                    />
                  </svg>
                  <span>Inicio</span>
                </Link>
              </li>
              {session ? (
                <>
                  <li
                    id="dashboard"
                    className={getLinkClass("/empresa-profile")}
                  >
                    <Link
                      href="/empresa-profile/"
                      className="flex items-center w-full h-full"
                      onClick={onClose}
                    >
                      <Building2 className="h-[37px] w-5 mr-2" />
                      <span>Panel de Empresa</span>
                    </Link>
                  </li>
                  <li
                    id="crear-empleo"
                    className={getLinkClass("/empresa-profile/crear-empleo")}
                  >
                    <Link
                      href="/empresa-profile/crear-empleo"
                      className="flex items-center w-full h-full"
                      onClick={onClose}
                    >
                      <svg
                        className="h-[37px] w-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                      </svg>
                      <span>Publicar Empleo</span>
                    </Link>
                  </li>
                  <li
                    id="ofertas"
                    className={getLinkClass("/empresa-profile/ofertas")}
                  >
                    <Link
                      href="/empresa-profile/ofertas"
                      className="flex items-center w-full h-full"
                      onClick={onClose}
                    >
                      <svg
                        className="h-[37px] w-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                      </svg>
                      <span>Mis Ofertas</span>
                    </Link>
                  </li>
                  <li
                    id="postulaciones"
                    className={getLinkClass("/empresa-profile/postulaciones")}
                  >
                    <Link
                      href="/empresa-profile/postulaciones"
                      className="flex items-center w-full h-full"
                      onClick={onClose}
                    >
                      <svg
                        className="h-[37px] w-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                      </svg>
                      <span>Postulaciones</span>
                    </Link>
                  </li>
                  <li
                    id="configuracion"
                    className={getLinkClass("/empresa-profile/configuracion")}
                  >
                    <Link
                      href="/empresa-profile/configuracion"
                      className="flex items-center w-full h-full"
                      onClick={onClose}
                    >
                      <svg
                        className="h-[37px] w-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                      </svg>
                      <span>Configuración</span>
                    </Link>
                  </li>
                  <li className="px-5 py-2 cursor-pointer hover:bg-gray-100 rounded flex items-center">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full h-full text-left cursor-pointer"
                      type="button"
                    >
                      <svg
                        className="h-[37px] w-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 4.001H5v14a2 2 0 0 0 2 2h8m1-5 3-3m0 0-3-3m3 3H9"
                        />
                      </svg>
                      <span className="text-red-700">Salir</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li id="login" className={getLinkClass("/auth/login")}>
                    <Link
                      href="/auth/login"
                      className="flex items-center w-full h-full"
                      onClick={onClose}
                    >
                      <LockKeyholeOpen className="h-[37px] w-5 mr-2" />
                      <span>Ingresar</span>
                    </Link>
                  </li>
                  <li id="signup" className={getLinkClass("/auth/empresa")}>
                    <Link
                      href="/auth/empresa"
                      className="flex items-center w-full h-full"
                      onClick={onClose}
                    >
                      <svg
                        className="h-[37px] w-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                      </svg>
                      <span>Registrar Empresa</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
