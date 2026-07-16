"use client";
import { useAuthStore } from "@/context/authStore";
import { getCurriculumByUserId, getUserPic } from "@/lib/user/info";
import { getCompanyLogo } from "@/lib/company/profile";
import { ROLES } from "@/types/auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Bell, LogOut, Menu, MessageSquare, User } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import MessageDropdown from "./MessageDropdown";
import FloatingChatWindows from "@/components/mensajes/FloatingChatWindow";
import { PremiumButton } from "./PremiumButton";
import { MESSAGING_ENABLED } from "@/lib/utils";

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
  onLogout?: () => void;
}

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Ofertas", href: "/empleos-busqueda" },
  { label: "Para Empresas", href: "/buscar-candidatos" },
];

const CANDIDATE_NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "/perfil" },
  { label: "Ofertas", href: "/empleos-busqueda" },
];

function getDashboardHref(role?: string) {
  if (role === ROLES.Postulante) return "/perfil";
  if (
    role === ROLES.AdministradorEmpresa ||
    role === ROLES.AdministradorDeEmpresa
  ) return "/empresa-perfil";
  if (role) return "/admin";
  return "/";
}

function isAdminRole(role?: string) {
  return (
    !!role &&
    role !== ROLES.Postulante &&
    role !== ROLES.AdministradorEmpresa &&
    role !== ROLES.AdministradorDeEmpresa
  );
}

export default function Navbar({
  showCompanyRegister = false,
  onHamburgerClick,
  isAsideOpen = false,
  navLinks,
  profileButtonLabel = "Mi Perfil",
  logoHref = "/",
  onLogout,
}: NavbarProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const id = useAuthStore((s) => s.id);
  const unreadNotifications = useAuthStore((s) => s.unreadNotifications);
  const unreadMessages = useAuthStore((s) => s.unreadMessages);
  const hydrate = useAuthStore((s) => s.hydrate);
  const isCompanyAdmin =
    session?.user?.role === ROLES.AdministradorEmpresa ||
    session?.user?.role === ROLES.AdministradorDeEmpresa;
  const [notifOpen, setNotifOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const resolvedLogoHref =
    status === "authenticated" ? getDashboardHref(session?.user?.role) : logoHref;
  const resolvedNavLinks =
    navLinks ??
    (status !== "authenticated"
      ? DEFAULT_NAV_LINKS
      : session?.user?.role === ROLES.Postulante
        ? CANDIDATE_NAV_LINKS
        : []);

  const handleUserSession = useCallback(async () => {
    if (id || !session) return;
    const { user } = session;
    const isAdmin = isCompanyAdmin && user.idEmpresa;
    const shouldLoadCandidateAssets = !isAdmin && !isAdminRole(user.role);
    const [picture, logo, curriculum] = await Promise.all([
      shouldLoadCandidateAssets ? getUserPic(user) : undefined,
      isAdmin ? getCompanyLogo(user.idEmpresa!, user.accessToken) : undefined,
      shouldLoadCandidateAssets ? getCurriculumByUserId(user) : undefined,
    ]);

    hydrate({
      ...user,
      idCurriculum: curriculum?.idCurriculum ?? "",
      pic: picture,
      idEmpresa: user.idEmpresa,
      companyLogo: logo,
    });
  }, [hydrate, id, isCompanyAdmin, session]);

  useEffect(() => {
    if (status === "authenticated") handleUserSession();
  }, [handleUserSession, status]);

  return (
    <>
    <nav className="sticky top-0 z-50 w-full py-3 bg-white/95 backdrop-blur-md border-b border-zinc-100 shadow-sm transition-all duration-300">
      <div className="container flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Link
          href={resolvedLogoHref}
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
        {status === "authenticated" && resolvedNavLinks.length > 0 && (
          <div className="hidden lg:flex items-center gap-8">
            {resolvedNavLinks
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
                        : "text-slate-600"
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
                    <Bell className="size-5 text-slate-600" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                        {unreadNotifications > 99 ? "99+" : unreadNotifications}
                      </span>
                    )}
                  </button>

                  <NotificationDropdown
                    isOpen={notifOpen}
                    onClose={() => setNotifOpen(false)}
                  />
                </div>

                {/* Message bell — solo si la mensajería está activa */}
                {MESSAGING_ENABLED && (
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Mensajes"
                    onClick={() => { setMsgOpen((prev) => !prev); setNotifOpen(false); }}
                    className="relative p-2 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="size-5 text-slate-600" />
                    {unreadMessages > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                        {unreadMessages > 99 ? "99+" : unreadMessages}
                      </span>
                    )}
                  </button>

                  <MessageDropdown
                    isOpen={msgOpen}
                    onClose={() => setMsgOpen(false)}
                  />
                </div>
                )}

                {/* Mi Perfil button — opens sidebar on all screen sizes */}
                <PremiumButton
                  type="button"
                  onClick={onHamburgerClick}
                  variant="primary"
                  size="sm"
                  icon={<User />}
                >
                  {profileButtonLabel}
                </PremiumButton>
                {/* Logout button — desktop only, visible alongside Mi Perfil */}
                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    aria-label="Cerrar sesión"
                    title="Cerrar sesión"
                    className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer px-2 py-1.5 rounded-md hover:bg-red-50"
                  >
                    <LogOut className="size-4" />
                    <span>Salir</span>
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="hidden lg:flex items-center gap-3">
                  {!pathname.startsWith("/perfil") && (
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
    {/* Ventana flotante de chat — fuera del nav para evitar overflow clip */}
    {MESSAGING_ENABLED && <FloatingChatWindows />}
    </>
  );
}
