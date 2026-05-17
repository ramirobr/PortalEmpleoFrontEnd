"use client";
import { useAuthStore } from "@/context/authStore";
import { getCurriculumByUserId, getUserPic } from "@/lib/user/info";
import { getCompanyLogo } from "@/lib/company/profile";
import { ROLES } from "@/types/auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Menu, User } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { PremiumButton } from "./PremiumButton";

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  showCompanyRegister?: boolean;
  onHamburgerClick?: () => void;
  isAsideOpen?: boolean;
  navLinks?: NavLink[];
  profileButtonLabel?: string;
  logoHref?: string;
}

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Ofertas", href: "/empleos-busqueda" },
  { label: "Para Empresas", href: "/buscar-candidatos" },
];

export default function Navbar({
  showCompanyRegister = false,
  onHamburgerClick,
  isAsideOpen = false,
  navLinks = DEFAULT_NAV_LINKS,
  profileButtonLabel = "Mi Perfil",
  logoHref = "/",
}: NavbarProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const id = useAuthStore((s) => s.id);
  const unreadNotifications = useAuthStore((s) => s.unreadNotifications);
  const hydrate = useAuthStore((s) => s.hydrate);
  const isCompanyAdmin = session?.user?.role === ROLES.AdministradorEmpresa;
  const [notifOpen, setNotifOpen] = useState(false);

  const handleUserSession = async () => {
    if (id || !session) return;
    const { user } = session;
    const isAdmin = isCompanyAdmin && user.idEmpresa;
    const [picture, logo, curriculum] = await Promise.all([
      isAdmin ? undefined : getUserPic(user),
      isAdmin ? getCompanyLogo(user.idEmpresa!, user.accessToken) : undefined,
      isAdmin ? undefined : getCurriculumByUserId(user),
    ]);

    hydrate({
      ...user,
      idCurriculum: curriculum?.idCurriculum ?? "",
      pic: picture,
      idEmpresa: user.idEmpresa,
      companyLogo: logo,
    });
  };

  useEffect(() => {
    if (status === "authenticated") handleUserSession();
  }, [status]);

  return (
    <nav className="sticky top-0 z-50 w-full py-3 bg-white/95 backdrop-blur-md border-b border-zinc-100 shadow-sm transition-all duration-300">
      <div className="container flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Link
          href={logoHref}
          aria-label="Ir a la página principal"
          className="shrink-0"
        >
          <Image
            src="/logos/logo-empresa.jpg"
            alt="implica"
            width={130}
            height={44}
            loading="lazy"
          />
        </Link>

        {/* Center: Nav links (desktop only) */}
        {status === "authenticated" && (
          <div className="hidden lg:flex items-center gap-8">
            {navLinks
              .filter(
                (link) =>
                  link.href !== "/buscar-candidatos" &&
                  link.href !== "/auth/empresa"
              )
              .map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive
                        ? "text-primary border-b-2 border-primary pb-0.5"
                        : "text-zinc-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
          </div>
        )}

        {/* Right: actions */}
        {status !== "loading" && (
          <div className="flex items-center gap-3">
            {session ? (
              <>
                {/* Bell notification */}
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Notificaciones"
                    onClick={() => setNotifOpen((prev) => !prev)}
                    className="relative p-2 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
                  >
                    <Bell className="size-5 text-zinc-600" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                        {unreadNotifications > 99 ? "99+" : unreadNotifications}
                      </span>
                    )}
                  </button>

                  <NotificationDropdown
                    isOpen={notifOpen}
                    onClose={() => setNotifOpen(false)}
                  />
                </div>

                {/* Mi Perfil button */}
                <PremiumButton
                  type="button"
                  onClick={onHamburgerClick}
                  variant="primary"
                  size="sm"
                  icon={<User />}
                >
                  {profileButtonLabel}
                </PremiumButton>
              </>
            ) : (
              <>
                <div className="hidden lg:flex items-center gap-3">
                  {!pathname.startsWith("/profile") && (
                    <>
                      <PremiumButton href="/auth/email" variant="outline" size="sm">
                        Crear cuenta
                      </PremiumButton>
                      {pathname !== "/auth/login" && (
                        <PremiumButton href="/auth/login" variant="primary" size="sm">
                          Ingresar
                        </PremiumButton>
                      )}
                    </>
                  )}
                  {showCompanyRegister && (
                    <PremiumButton href="/auth/empresa" variant="secondary" size="sm">
                      Empresa
                    </PremiumButton>
                  )}
                </div>
                {/* Mobile hamburger for unauthenticated */}
                <button
                  type="button"
                  aria-label="Abrir menú"
                  aria-pressed={isAsideOpen}
                  onClick={onHamburgerClick}
                  className="lg:hidden p-2 rounded border border-zinc-200 bg-white shadow hover:bg-zinc-50 cursor-pointer"
                >
                  <Menu className="size-5 text-primary" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
