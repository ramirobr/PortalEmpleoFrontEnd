"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";

export type NavLink = {
  name: string;
  href?: string;
  icon?: ReactNode;
  id?: string;
  onClick?: () => void;
  className?: string;
};

type AsideMenuProps = {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
  side?: "left" | "right";
  links: NavLink[];
};

export default function AsideMenu({
  isOpen = false,
  onClose,
  className = "w-1/2 max-w-sm",
  side = "right",
  links = [],
}: AsideMenuProps) {
  const pathname = usePathname();

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

  const getLinkClass = (path?: string) => {
    if (!path)
      return "px-5 py-2 cursor-pointer hover:bg-gray-100 rounded flex items-center";

    let isActive = false;
    if (path === "/") {
      isActive = pathname === "/";
    } else {
      isActive = pathname.startsWith(path);
    }

    return isActive
      ? "bg-blue-50 rounded px-5 py-2 font-semibold text-primary flex items-center"
      : "px-5 py-2 cursor-pointer hover:bg-gray-100 rounded flex items-center";
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-60 flex h-full flex-col bg-white shadow-lg transition-transform duration-300 transform  ${
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
              {links.map((link) => (
                <li
                  key={link.href || link.name}
                  id={link.id}
                  className={getLinkClass(link.href)}
                >
                  {link.href ? (
                    <Link
                      href={link.href}
                      className="flex items-center w-full h-full"
                      onClick={() => {
                        if (link.onClick) link.onClick();
                        if (onClose) onClose();
                      }}
                    >
                      {link.icon && (
                        <span className="h-[37px] w-5 mr-2 flex items-center justify-center">
                          {link.icon}
                        </span>
                      )}
                      <span className={link.className}>{link.name}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        if (link.onClick) link.onClick();
                        if (onClose) onClose();
                      }}
                      className="flex items-center w-full h-full text-left cursor-pointer"
                    >
                      {link.icon && (
                        <span className="h-[37px] w-5 mr-2 flex items-center justify-center">
                          {link.icon}
                        </span>
                      )}
                      <span className={link.className}>{link.name}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
