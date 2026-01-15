import { fetchApi } from "@/lib/apiClient";
import { Logout } from "@/types/user";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Dashboard from "../../../app/profile/components/Dashboard";

type AsideMenuProps = {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
  side?: "left" | "right";
};

export default function AsideMenu({
  isOpen = false,
  onClose,
  className = "w-1/2 max-w-sm",
  side = "right",
}: AsideMenuProps) {
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
    } else if (path === "/profile" || path === "/profile/") {
      isActive = pathname === "/profile" || pathname === "/profile/";
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
        className={`fixed inset-y-0 left-0 z-40 flex h-full flex-col bg-white shadow-lg transition-transform duration-300 transform ${
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
                  <li id="dashboard" className={getLinkClass("/profile")}>
                    <Link
                      href="/profile/"
                      className="flex items-center w-full h-full"
                      onClick={onClose}
                    >
                      <svg
                        className="h-[37px] w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M15 2H5L4 3v14l1 1h10l1-1V3l-1-1m0 15H5v-3h2a1 1 0 0 0 2 0 1 1 0 0 0-2-1H5v-3h2a1 1 0 0 0 2 0 1 1 0 0 0-2 0H5V7h2a1 1 0 0 0 2-1 1 1 0 0 0-2 0H5V3h10v14zm-8-3 1-1v1H7m0-4h1-1m0-4h1c1 0 0 0 0 0v1L7 6" />
                      </svg>
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li
                    id="perfil-edit"
                    className={getLinkClass("/profile/edit")}
                  >
                    <Link
                      href="/profile/edit"
                      className="flex items-center w-full h-full"
                      onClick={onClose}
                    >
                      <svg
                        className="h-[37px] w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
                      </svg>
                      <span>Editar Perfil</span>
                    </Link>
                  </li>
                  <li
                    id="perfil-favoritos"
                    className={getLinkClass("/profile/favoritos")}
                  >
                    <Link
                      href="/profile/favoritos"
                      className="flex items-center w-full h-full"
                      onClick={onClose}
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
                          d="M19.071 13.142 13.414 18.8a2 2 0 0 1-2.828 0l-5.657-5.657A5 5 0 1 1 12 6.072a5 5 0 0 1 7.071 7.07"
                        />
                      </svg>
                      <span>Empleos favoritos</span>
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
                      <svg
                        className="h-[37px] w-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                      </svg>
                      <span>Ingresar</span>
                    </Link>
                  </li>
                  <li id="signup" className={getLinkClass("/auth/signin")}>
                    <Link
                      href="/auth/signin"
                      className="flex items-center w-full h-full"
                      onClick={onClose}
                    >
                      <svg
                        className="h-[37px] w-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      <span>Crear cuenta</span>
                    </Link>
                  </li>
                  <li
                    id="company-signup"
                    className={getLinkClass("/auth/empresa")}
                  >
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
                      <span>Regístrate como empresa</span>
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
