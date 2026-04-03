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
import { Search, FileText, Mail, Briefcase, MapPin, Clock } from "lucide-react";
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
        <div className="flex flex-col gap-6">
          {currentAplicantes.map((aplicante) => (
            <div
              key={aplicante.usuario.idAplicacion}
              className="group bg-white shadow-sm hover:shadow-2xl transition-all duration-500 rounded-xl overflow-hidden p-8 flex flex-col lg:flex-row items-center gap-8 border border-slate-50 hover:-translate-y-1.5"
            >
              <div className="flex flex-col sm:flex-row items-center gap-8 flex-1 w-full">
                {/* Avatar with Status Ring */}
                <div className="relative shrink-0">
                  <Avatar className="size-20 border-[3px] border-white shadow-lg group-hover:scale-105 transition-transform duration-500">
                    {aplicante.usuario.fotografia && (
                      <AvatarImage
                        src={aplicante.usuario.fotografia}
                        alt={aplicante.usuario.nombreCompleto}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-primary/5 text-primary text-2xl font-black font-display uppercase">
                      {aplicante.usuario.nombreCompleto
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 size-5 rounded-full border-4 border-white shadow-sm" />
                </div>

                {/* Main Info */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex items-center gap-3 justify-center sm:justify-start">
                    <h3 className="font-display font-black text-primary text-2xl uppercase tracking-tight group-hover:text-primary-container transition-colors duration-300">
                      {aplicante.usuario.nombreCompleto}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 italic">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="size-3.5 text-primary" />
                      {aplicante.usuario.habilidades[0] || "ESPECIALISTA"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-primary" />
                      {aplicante.usuario.ubicacion}
                    </span>
                  </div>
                </div>
              </div>

              {/* Meta & Status */}
              <div className="flex flex-col items-center lg:items-end gap-3 min-w-[180px] w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                <Pill
                  variant={getStatusVariant(
                    aplicante.usuario.estadoAplicacion.nombre,
                  )}
                  className="uppercase text-[9px] font-black tracking-[0.2em] px-5 py-2 rounded-full whitespace-nowrap"
                  noButton
                >
                  {aplicante.usuario.estadoAplicacion.nombre}
                </Pill>
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-1.5 italic">
                   <Clock className="size-3" />
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

              {/* Actions - Signature CTA Style */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                <button
                  className="flex items-center justify-center gap-3 px-10 py-2.5 bg-slate-50 text-slate-900 font-black text-[11px] uppercase tracking-widest rounded-full hover:bg-slate-100 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer min-w-[150px] w-full sm:w-auto"
                >
                  <FileText className="size-4" />
                  Visualizar CV
                </button>
                <button
                  className="relative group/btn flex items-center justify-center gap-3 px-12 py-2.5 bg-linear-to-r from-secondary-container to-secondary text-white font-black text-[11px] uppercase tracking-widest rounded-full hover:shadow-2xl hover:shadow-secondary/30 transition-all duration-500 cursor-pointer min-w-[160px] w-full sm:w-auto overflow-hidden hover:-translate-y-1"
                >
                  <div className="absolute inset-x-0 top-0 h-full w-full bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 skew-x-12" />
                  <Mail className="size-4 relative z-10" />
                  <span className="relative z-10">Contactar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
