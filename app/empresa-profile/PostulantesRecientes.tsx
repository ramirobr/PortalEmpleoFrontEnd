"use client";

import { useState } from "react";
import Pill from "@/components/shared/components/Pill";
import { AplicanteReciente } from "@/types/company";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import TablePagination from "@/components/shared/components/TablePagination";

interface PostulantesRecientesProps {
  aplicantes: AplicanteReciente[];
}

export default function PostulantesRecientes({
  aplicantes,
}: PostulantesRecientesProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalItems = aplicantes.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startParam = (currentPage - 1) * pageSize;
  const endParam = Math.min(startParam + pageSize, totalItems);
  const currentAplicantes = aplicantes.slice(startParam, endParam);

  const getStatusVariant = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("nuevo")) return "green";
    if (s.includes("entrevista")) return "orange"; // yellow/orange for interview
    if (s.includes("descartado")) return "gray"; // or red, per design image gray seems more like "seen" or "discarded" sometimes, but let's stick to pill logic
    if (s.includes("visto")) return "gray";
    return "blue";
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
            <Card
              key={aplicante.usuario.idAplicacion}
              className="flex flex-col md:flex-row items-center p-4 gap-4 transition-all hover:shadow-md"
            >
              {/* Avatar */}
              <Avatar className="size-12 md:size-14">
                {aplicante.usuario.fotografia && (
                  <AvatarImage
                    src={aplicante.usuario.fotografia}
                    alt={aplicante.usuario.nombreCompleto}
                  />
                )}
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                  {aplicante.usuario.nombreCompleto
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              {/* Main Info */}
              <div className="flex-1 text-center md:text-left space-y-1">
                <h3 className="font-bold text-gray-900 text-lg">
                  {aplicante.usuario.nombreCompleto}
                </h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">
                      {/* Placeholder for Job Title if available, or just use a generic title/skill */}
                      {aplicante.usuario.habilidades[0] || "Candidato"}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    {aplicante.usuario.ubicacion}
                  </span>
                </div>
              </div>

              {/* Status and Time */}
              <div className="flex flex-col items-center md:items-end gap-1 min-w-[140px]">
                <Pill
                  variant={getStatusVariant(
                    aplicante.usuario.estadoAplicacion.nombre,
                  )}
                  className="uppercase text-[10px] font-bold tracking-wider"
                  noButton
                >
                  {aplicante.usuario.estadoAplicacion.nombre}
                </Pill>
                <span className="text-xs text-gray-400">
                  Postulado{" "}
                  {(() => {
                    const dateStr =
                      aplicante.usuario.fechaAplicacion ||
                      // Fallback for demo if no date exists
                      new Date().toISOString();

                    const date = new Date(dateStr);
                    // Check if date is valid
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
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary font-medium hover:text-primary/80 hover:bg-primary/10"
                >
                  <FileText className="mr-2 size-4" />
                  Ver CV
                </Button>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white shadow-none"
                >
                  <Mail className="mr-2 size-4" />
                  Contactar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {totalItems > 0 && (
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          itemLabel="candidatos"
          onPageChange={handlePageChange}
          className="border-none bg-transparent px-0"
        />
      )}
    </section>
  );
}
