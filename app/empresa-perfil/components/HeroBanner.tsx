"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Megaphone, Briefcase, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface HeroBannerProps {
  companyName: string;
  cvsRecibidos: number;
  procesosActivos: number;
  anunciosCount: number;
  ofertasActivas: number;
  contrataciones: number;
  companyLogo?: string | null;
}

export default function HeroBanner({
  companyName,
  cvsRecibidos,
  procesosActivos,
  anunciosCount,
  ofertasActivas,
  contrataciones,
  companyLogo,
}: HeroBannerProps) {
  const { push } = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = searchTerm.trim()
      ? `?q=${encodeURIComponent(searchTerm)}`
      : "";
    push(`/empresa-perfil/buscar-candidatos${params}`);
  };

  const initials = companyName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative w-full overflow-hidden mb-0">
      {/* Background with premium primary color */}
      <div className="absolute inset-0 bg-primary" />
      
      {/* Texture/Overlay */}
      <div 
        className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" 
        aria-hidden="true" 
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between px-8 py-10 gap-6">
        {/* Left: Welcome text + search */}
        <div className="flex-1 max-w-xl">
          <h1 className="text-3xl lg:text-4xl font-semibold text-white mb-2 leading-tight">
            ¡Bienvenido, {companyName}! 👋
          </h1>
          <p className="text-white/90 text-base mb-6">
            Gestiona tus vacantes y encuentra el talento ideal para tu equipo.
          </p>

          {/* Search bar — full rounded premium style */}
          <form onSubmit={handleSearch} className="relative flex items-stretch w-full max-w-lg group h-14">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex items-center pointer-events-none">
              <Search className="size-5 text-slate-400 group-focus-within:text-secondary transition-colors" />
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Busca candidatos… (marketing, ingeniería, etc.)"
              className="w-full pl-14 pr-6 rounded-full bg-white text-slate-700 text-sm shadow-2xl border-2 border-transparent focus:border-secondary/20 focus:ring-4 focus:ring-secondary/10 transition-all outline-none"
            />
          </form>
        </div>

        {/* Right: Company Profile Card (Glassmorphism) */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-6 flex flex-col items-center min-w-[240px]">
          {/* Logo/Avatar */}
          <div className="size-20 rounded-xl bg-white shadow-inner overflow-hidden mb-4 flex items-center justify-center p-2 border border-white/30">
            {companyLogo ? (
              <Image
                src={companyLogo}
                alt={companyName}
                width={80}
                height={80}
                className="w-full h-full object-contain"
                unoptimized
              />
            ) : (
              <span className="text-3xl font-bold text-primary">
                {initials}
              </span>
            )}
          </div>

          <h2 className="text-white font-semibold text-lg text-center mb-1">
            {companyName}
          </h2>
          <p className="text-white/70 text-xs uppercase tracking-widest font-bold mb-4">
            Dashboard Empresa
          </p>

          {/* Quick stats in card */}
          <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-white font-bold text-lg leading-none">{procesosActivos}</p>
              <p className="text-white/60 text-[12px] uppercase mt-1">Procesos</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg leading-none">{ofertasActivas}</p>
              <p className="text-white/60 text-[12px] uppercase mt-1">Ofertas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
