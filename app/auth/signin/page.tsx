"use client";

import { useState } from "react";
import Navbar from "../../../components/shared/components/Navbar";
import Footer from "../../../components/shared/components/Footer";
import AsideMenu, {
  NavLink,
} from "../../../components/shared/components/AsideMenu";

import { LockKeyholeOpen, UserRoundPlus, Building2 } from "lucide-react";

export default function SignIn() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const authLinks: NavLink[] = [
    {
      name: "Ingresar",
      href: "/auth/login",
      icon: <LockKeyholeOpen />,
    },
    {
      name: "Crear cuenta",
      href: "/auth/email",
      icon: <UserRoundPlus />,
    },
    {
      name: "Regístrate como empresa",
      href: "/auth/empresa",
      icon: <Building2 />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        onHamburgerClick={toggleMobileMenu}
        isAsideOpen={isMobileMenuOpen}
      />
      <AsideMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        side="left"
        className="w-1/2 max-w-sm"
        links={authLinks}
      />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h2 className="section-title">
          Crea tu cuenta y comienza a buscar empleo
        </h2>
        <div className="w-full max-w-md flex flex-col gap-4">
          <button className="cursor-pointer flex items-center justify-center gap-2 w-full py-3 rounded bg-white border border-gray-300 font-semibold text-base text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2">
            Acceder con Google
          </button>
          <button className="cursor-pointer flex items-center justify-center gap-2 w-full py-3 rounded bg-[#2867B2] text-white font-semibold text-base hover:bg-[#205081] focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2">
            Acceder con Linkedin
          </button>
          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="mx-4 text-gray-500 font-semibold">o</span>
            <hr className="flex-1 border-gray-300" />
          </div>
          <a
            href="/auth/email"
            className="flex items-center gap-2 px-4 py-3 rounded border border-gray-300 bg-white text-gray-800 font-medium text-lg shadow hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span className="text-2xl">✉️</span>
            Continuar con correo electrónico
          </a>
        </div>
        {/*
        <div className="mt-8 text-center">
          <p className="font-semibold mb-2">¡Descarga la app en tu celular!</p>
          <div className="flex justify-center gap-4 mb-4">
            <a href="https://play.google.com/store" aria-label="Google Play">
              <img
                src="/badges/google-play-badge.png"
                alt="Disponible en Google Play"
                className="h-12"
              />
            </a>
            <a href="https://www.apple.com/app-store/" aria-label="App Store">
              <img
                src="/badges/app-store-badge.png"
                alt="Consíguelo en App Store"
                className="h-12"
              />
            </a>
          </div>
          <div className="flex justify-center gap-6 text-2xl text-gray-400 mt-4">
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="hover:text-primary"
            >
              Facebook
            </a>
            <a
              href="https://tiktok.com"
              aria-label="TikTok"
              className="hover:text-primary"
            >
              TikTok
            </a>
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="hover:text-primary"
            >
              Instagram
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              className="hover:text-primary"
            >
              LinkedIn
            </a>
            <a
              href="https://youtube.com"
              aria-label="YouTube"
              className="hover:text-primary"
            >
              YouTube
            </a>
          </div>
        </div>
        */}
      </main>
      <Footer />
    </div>
  );
}
