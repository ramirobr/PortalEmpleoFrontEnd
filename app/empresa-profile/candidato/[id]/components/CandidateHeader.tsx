"use client";

import { DatosPersonales } from "@/types/user";
import UserAvatar from "@/components/shared/components/UserAvatar";
import Badge from "@/components/shared/components/Badge";
import { MapPinIcon } from "@/components/shared/icons/Icons";

interface CandidateHeaderProps {
  datosPersonales: DatosPersonales;
  ubicacion: string;
  picture?: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-EC", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export default function CandidateHeader({
  datosPersonales,
  ubicacion,
  picture,
}: CandidateHeaderProps) {
  const fullName = `${datosPersonales.nombre} ${datosPersonales.apellido}`;
  const age = calculateAge(datosPersonales.fechaNacimiento);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <UserAvatar
            src={picture}
            size={120}
            alt={`Foto de ${fullName}`}
            className="ring-4 ring-gray-100"
          />
        </div>

        {/* Main Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
              <div className="flex items-center text-gray-500 mt-1 gap-1">
                <MapPinIcon className="w-4 h-4" />
                <span>{ubicacion}</span>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Edad
              </p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {age} años
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Nacionalidad
              </p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {datosPersonales.nacionalidad || "No especificada"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Género
              </p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {datosPersonales.genero || "No especificado"}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex flex-wrap gap-3 mt-4">
            {datosPersonales.movilidad && (
              <Badge
                variant="custom"
                bgColor="bg-purple-100"
                textColor="text-purple-700"
              >
                <svg
                  className="w-3 h-3 mr-1 inline"
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
              </Badge>
            )}
            {datosPersonales.licencia && (
              <Badge
                variant="custom"
                bgColor="bg-orange-100"
                textColor="text-orange-700"
              >
                <svg
                  className="w-3 h-3 mr-1 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Licencia: {datosPersonales.tipoLicencia.join(", ")}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
