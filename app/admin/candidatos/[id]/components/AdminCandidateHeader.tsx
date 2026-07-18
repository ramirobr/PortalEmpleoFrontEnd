"use client";

import { Calendar } from "lucide-react";
import { DatosPersonales } from "@/types/user";
import UserAvatar from "@/components/shared/components/UserAvatar";
import Pill from "@/components/shared/components/Pill";
import { MapPinIcon } from "@/components/shared/icons/Icons";
import { formatDate } from "@/lib/utils";
import { useHasMounted } from "@/lib/hooks";

interface AdminCandidateHeaderProps {
  datosPersonales: DatosPersonales;
  ubicacion: string;
  picture?: string;
  estadoCuenta: string;
  fechaRegistro: string;
}

function calculateAge(birthDate: string): number {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function getEstadoColor(estado: string): { bg: string; text: string } {
  switch (estado.toLowerCase()) {
    case "activa":
    case "activo":
      return { bg: "bg-green-100", text: "text-green-700" };
    case "pendiente":
      return { bg: "bg-yellow-100", text: "text-yellow-700" };
    case "inactiva":
    case "inactivo":
    case "suspendida":
    case "suspendido":
      return { bg: "bg-red-100", text: "text-red-700" };
    default:
      return { bg: "bg-zinc-100", text: "text-slate-700" };
  }
}

export default function AdminCandidateHeader({
  datosPersonales,
  ubicacion,
  picture,
  estadoCuenta,
  fechaRegistro,
}: AdminCandidateHeaderProps) {
  const hasMounted = useHasMounted();
  const fullName = `${datosPersonales.nombre} ${datosPersonales.apellido}`;
  const age = hasMounted ? calculateAge(datosPersonales.fechaNacimiento) : 0;
  const estadoColor = getEstadoColor(estadoCuenta);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="shrink-0">
          <UserAvatar
            src={picture}
            size={120}
            alt={`Foto de ${fullName}`}
            className="ring-4 ring-zinc-100"
          />
        </div>

        {/* Main Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="text-2xl font-semibold text-slate-900">{fullName}</h2>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${estadoColor.bg} ${estadoColor.text}`}
                >
                  {estadoCuenta}
                </span>
              </div>
              <div className="flex items-center text-slate-500 gap-1">
                <MapPinIcon className="size-4" />
                <span>{ubicacion}</span>
              </div>
              <div className="flex items-center text-xs text-slate-400 gap-1 mt-1">
                <Calendar className="size-3" />
                Registro: {formatDate(fechaRegistro)}
              </div>
            </div>
          </div>

          {/* Personal Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Edad</p>
              <p className="text-sm font-medium text-slate-900 mt-1">
                {hasMounted && age > 0 ? `${age} años` : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Nacionalidad</p>
              <p className="text-sm font-medium text-slate-900 mt-1">
                {datosPersonales.nacionalidad || "No especificada"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Género</p>
              <p className="text-sm font-medium text-slate-900 mt-1">
                {datosPersonales.genero || "No especificado"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Tipo documento</p>
              <p className="text-sm font-medium text-slate-900 mt-1">
                {datosPersonales.tipoDocumento || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Número documento</p>
              <p className="text-sm font-medium text-slate-900 mt-1">
                {datosPersonales.numeroDocumento || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Fecha nacimiento</p>
              <p className="text-sm font-medium text-slate-900 mt-1">
                {formatDate(datosPersonales.fechaNacimiento)}
              </p>
            </div>
          </div>

          {/* Pills */}
          <div className="flex flex-wrap gap-3 mt-4">
            {datosPersonales.movilidad && (
              <Pill variant="custom" bgColor="bg-purple-100" textColor="text-purple-700">
                <svg
                  className="size-3 mr-1 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                  />
                </svg>
                Disponibilidad de movilidad
              </Pill>
            )}
            {datosPersonales.licencia && (
              <Pill variant="custom" bgColor="bg-orange-100" textColor="text-orange-700">
                <svg
                  className="size-3 mr-1 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
                {datosPersonales.tipoLicencia?.join(", ") || "Licencia de conducir"}
              </Pill>
            )}
            {datosPersonales.tieneDiscapacidad && (
              <Pill variant="custom" bgColor="bg-blue-100" textColor="text-blue-700">
                Tiene discapacidad
                {datosPersonales.porcentajeDiscapacidad
                  ? ` (${datosPersonales.porcentajeDiscapacidad}%)`
                  : ""}
              </Pill>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
