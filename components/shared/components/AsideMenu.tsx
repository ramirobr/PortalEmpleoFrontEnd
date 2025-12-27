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
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill="currentColor"
                      d="M6 19h3.692v-5.884h4.616V19H18v-9l-6-4.538L6 10zm-1 1V9.5l7-5.288L19 9.5V20h-5.692v-5.884h-2.616V20zm7-7.77"
                    />
                  </svg>
                  <span>Inicio</span>
                </Link>
              </li>
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
              <li id="perfil-edit" className={getLinkClass("/profile/edit")}>
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
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
