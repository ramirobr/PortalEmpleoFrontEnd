"use client";

import { Search, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/context/authStore";

interface DashboardHeroBannerProps {
  userName: string;
  userPic?: string;
  perfilCompletado?: number;
}

export default function DashboardHeroBanner({
  userName: propUserName,
  userPic: propPic,
  perfilCompletado,
}: DashboardHeroBannerProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const storeFullName = useAuthStore((s) => s.fullName);
  const storePic = useAuthStore((s) => s.pic);

  const userName = storeFullName || propUserName;
  const userPic = storePic || propPic;
  const firstName = userName?.split(" ")[0] ?? "";

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/empleos-busqueda?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/empleos-busqueda");
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl mb-0" style={{ minHeight: "280px" }}>
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/hero-city.jpg')",
          backgroundColor: "#115c6f",
        }}
      />
      <div className="absolute inset-0 bg-primary/75" />

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between px-8 py-10 gap-6">
        {/* Left: Welcome text + search */}
        <div className="flex-1 max-w-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
            ¡Bienvenido a tu Perfil, {firstName}!
          </h1>
          <p className="text-white/90 text-base mb-6">
            Encuentra las mejores ofertas de empleo para ti.
          </p>

          {/* Search bar */}
          <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-md">
            <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
            <input
              type="text"
              placeholder="Buscar empleos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-3 py-3 text-gray-700 text-sm outline-none bg-transparent"
            />
            <button
              onClick={handleSearch}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-sm font-semibold transition-colors cursor-pointer"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Right: Profile card */}
        <div className="bg-white rounded-xl shadow-lg px-5 py-4 flex flex-col items-center min-w-[180px] border border-gray-100">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-secondary/20 overflow-hidden border-2 border-secondary mb-3 flex items-center justify-center">
            {userPic ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userPic.startsWith("data:") ? userPic : `data:image/jpeg;base64,${userPic}`}
                alt={userName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <span className="text-2xl font-bold text-primary">
                {firstName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <p className="text-sm font-bold text-gray-800 text-center mb-2">{userName}</p>

          {/* Nivel de confianza badge */}
          <div className="flex items-center gap-1 bg-secondary/15 text-secondary rounded-full px-3 py-1">
            <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
            <span className="text-xs font-semibold">
              Nivel de Confianza: {perfilCompletado ?? 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
