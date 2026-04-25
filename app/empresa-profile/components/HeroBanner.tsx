"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Megaphone, Briefcase, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeroBannerProps {
  companyName: string;
  cvsRecibidos: number;
  procesosActivos: number;
  anunciosCount: number;
  ofertasActivas: number;
  contrataciones: number;
}

export default function HeroBanner({
  companyName,
  cvsRecibidos,
  procesosActivos,
  anunciosCount,
  ofertasActivas,
  contrataciones,
}: HeroBannerProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = searchTerm.trim()
      ? `?q=${encodeURIComponent(searchTerm)}`
      : "";
    router.push(`/empresa-profile/buscar-candidatos${params}`);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-surface-dark via-primary-deep to-primary min-h-[220px]">
      {/* Background overlay image */}
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=60')",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-surface-dark/80 to-primary/60" aria-hidden="true" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6 p-8 lg:p-10">
        {/* Left content */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white font-display leading-tight">
              ¡Bienvenido, {companyName}! 👋
            </h1>
            <p className="text-white/80 text-sm mt-1">
              Encuentra los mejores candidatos para tu empresa
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busca candidatos... (marketing, ingeniería, ventas, etc.)"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary hover:bg-primary-deep text-white font-bold text-sm rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              Buscar
            </button>
          </form>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-bold pt-1">
            <span className="flex items-center gap-1.5">
              <Users className="size-4 text-white/70" />
              <span className="text-white font-black">+{cvsRecibidos.toLocaleString()}</span> CVs Recibidos
            </span>
            <span className="text-white/40">|</span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="size-4 text-white/70" />
              <span className="text-white font-black">{procesosActivos}</span> Procesos Activos
            </span>
          </div>
        </div>

        {/* Right: Mis Anuncios card */}
        <div className="w-full lg:w-64 bg-white rounded-xl shadow-lg p-5 shrink-0">
          <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Megaphone className="size-4 text-secondary-container" />
            Mis Anuncios
          </h2>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Megaphone className="size-4 text-secondary-container/70" />
                Anuncios
              </div>
              <span className="font-bold text-gray-900">{anunciosCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase className="size-4 text-primary/70" />
                Ofertas Activas:
              </div>
              <span className="font-bold text-gray-900">{ofertasActivas}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="size-4 text-primary/70" />
                Contrataciones:
              </div>
              <span className="font-bold text-gray-900">{contrataciones.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
