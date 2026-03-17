"use client";

import Pill from "@/components/shared/components/Pill";
import { AplicanteReciente } from "@/types/company";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FileText, Mail } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface PostulantesRecientesProps {
  aplicantes: AplicanteReciente[];
}

export default function PostulantesRecientes({
  aplicantes,
}: PostulantesRecientesProps) {
  // Show only the latest 5 applicants
  const currentAplicantes = aplicantes.slice(0, 5);

  const getStatusVariant = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("nuevo")) return "green";
    if (s.includes("entrevista")) return "orange"; // yellow/orange for interview
    if (s.includes("descartado")) return "gray"; // or red, per design image gray seems more like "seen" or "discarded" sometimes, but let's stick to pill logic
    if (s.includes("visto")) return "gray";
    return "blue";
  };

  return (
    <section className="my-10" aria-labelledby="recent-applicants-title">
      <TituloSubrayado id="recent-applicants-title" className="text-gray-900">
        Postulaciones Recientes
      </TituloSubrayado>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
          <Input
            placeholder="Buscar por nombre, correo o palabra clave..."
            className="pl-10 bg-white"
          />
        </div>
        <div className="w-full md:w-64">
          <Select>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Todos los puestos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los puestos</SelectItem>
              {/* Add dynamic job titles here if available */}
            </SelectContent>
          </Select>
        </div>
      </div>

      {aplicantes.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No hay postulantes recientes
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {currentAplicantes.map((aplicante) => (
            <div
              key={aplicante.usuario.idAplicacion}
              className="bg-white border-primary shadow hover:shadow-lg relative border-l-8 border-l-primary rounded-xl transition-all overflow-hidden p-6 flex flex-col md:flex-row items-center gap-6"
            >
              {/* Avatar */}
              <Avatar className="size-16 border-2 border-gray-light">
                {aplicante.usuario.fotografia && (
                  <AvatarImage
                    src={aplicante.usuario.fotografia}
                    alt={aplicante.usuario.nombreCompleto}
                  />
                )}
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                  {aplicante.usuario.nombreCompleto
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              {/* Main Info */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-primary text-xl mb-1">
                  {aplicante.usuario.nombreCompleto}
                </h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-sm font-bold uppercase tracking-widest text-gray-400">
                  <span>
                    {aplicante.usuario.habilidades[0] || "Candidato"}
                  </span>
                  <span className="flex items-center gap-1 normal-case font-medium">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {aplicante.usuario.ubicacion}
                  </span>
                </div>
              </div>

              {/* Status and Time */}
              <div className="flex flex-col items-center md:items-end gap-2 min-w-[140px]">
                <Pill
                  variant={getStatusVariant(
                    aplicante.usuario.estadoAplicacion.nombre,
                  )}
                  className="uppercase text-[10px] font-extrabold tracking-widest px-4"
                  noButton
                >
                  {aplicante.usuario.estadoAplicacion.nombre}
                </Pill>
                <span className="text-xs text-gray-500 font-medium">
                   {(() => {
                    const dateStr =
                      aplicante.usuario.fechaAplicacion ||
                      new Date().toISOString();

                    const date = new Date(dateStr);
                    if (!isNaN(date.getTime())) {
                      return formatDistanceToNow(date, {
                        addSuffix: true,
                        locale: es,
                      });
                    }
                    return "recientemente";
                  })()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  className="flex items-center justify-center gap-2 px-6 py-2 border-2 border-primary text-primary font-bold text-sm uppercase rounded-lg hover:bg-primary/5 transition-colors cursor-pointer min-w-[140px]"
                >
                  <FileText className="size-4" />
                  Ver CV
                </button>
                <button
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-primary text-white font-bold text-sm uppercase rounded-lg hover:bg-secondary transition-colors cursor-pointer min-w-[140px]"
                >
                  <Mail className="size-4" />
                  Contactar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
