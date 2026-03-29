"use client";

import { CheckCircle2, Star } from "lucide-react";
import Link from "next/link";

interface DashboardProfileHeaderProps {
  userName: string;
  resumenProfesional?: string;
  userPic?: string;
  perfilCompletado?: number;
  promedioRecomendaciones?: number;
}

import { useAuthStore } from "@/context/authStore";

export default function DashboardProfileHeader({
  userName: propUserName,
  resumenProfesional: propResumen,
  userPic: propPic,
  perfilCompletado,
  promedioRecomendaciones,
}: DashboardProfileHeaderProps) {
  const storeFullName = useAuthStore((s) => s.fullName);
  const storeProfesion = useAuthStore((s) => s.profesion);
  const storePic = useAuthStore((s) => s.pic);

  const userName = storeFullName || propUserName;
  const resumenProfesional =
    storeProfesion ||
    propResumen ||
    "Chofer profesional - Licencia tipo D - 5 años de experiencia";
  const userPic = storePic || propPic;

  return (
    <div className="flex flex-col gap-8 mb-10 mt-6">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Avatar */}
        <div className="w-[140px] h-[140px] rounded-full bg-[#18a999] flex-shrink-0 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
          {userPic ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={
                userPic.startsWith("data:")
                  ? userPic
                  : `data:image/jpeg;base64,${userPic}`
              }
              alt={userName}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Error loading profile picture");
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}
        </div>

        {/* User Info & Progress */}
        <div className="flex-1 pt-2 w-full">
          <h1 className="text-[36px] font-normal text-black leading-none mb-2">
            {userName}
          </h1>
          <p className="text-[17px] text-black mb-4">{resumenProfesional}</p>

          {/* Progress Bar Container */}
          <div className="flex items-center gap-3 mb-4 w-full max-w-[500px]">
            <div className="flex-1 bg-[#18a999] rounded-full h-[32px] relative flex items-center overflow-hidden">
              {/* Filled portion */}
              <div
                className="absolute left-0 top-0 bottom-0 bg-[#167a93] rounded-full"
                style={{ width: `${perfilCompletado ?? 0}%` }}
              />
              <span className="relative z-10 text-white text-[16px] px-5 font-normal">
                Perfil {perfilCompletado ?? 0}% verificado
              </span>
            </div>
            <CheckCircle2
              className="w-[42px] h-[42px] text-primary shrink-0"
              fill="#167a93"
              color="white"
              strokeWidth={2.5}
            />
          </div>

          {/* Stars & Recommendations */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className="w-8 h-8 text-[#f8c51c]"
                fill={s <= Math.round(promedioRecomendaciones ?? 0) ? "#f8c51c" : "none"}
                stroke={s <= Math.round(promedioRecomendaciones ?? 0) ? "none" : "#f8c51c"}
              />
            ))}
            <Link
              href="/profile/recomendaciones"
              className="text-primary text-[15px] font-medium ml-3 hover:underline"
            >
              Ver recomendaciones de otras empresas
            </Link>
          </div>
        </div>
      </div>

      {/* Validation Alert Bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex items-center relative h-[80px] max-w-[800px]">
        {/* Left primary accent border */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-secondary rounded-l-xl" />

        <div className="flex-1 pl-10 pr-6 flex items-center justify-between">
          <p className="text-[18px] text-black pr-4">
            Valida tus datos y obtén más posibilidades de que tu perfil sea
            visto
          </p>
          <button className="bg-primary hover:bg-[#115c6f] text-white px-8 py-2 rounded-lg text-[18px] font-medium transition-colors cursor-pointer">
            Validar
          </button>
        </div>
      </div>
    </div>
  );
}
