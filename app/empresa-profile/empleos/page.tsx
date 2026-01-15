"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BriefcaseIcon,
  MapPinIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
} from "@/components/shared/icons/Icons";

// Mock Data
const jobs = [
  {
    id: 1,
    title: "Ingeniero de Software (Android), Librerías",
    company: "Segment",
    location: "Londres, RU",
    applications: "3+ Postulados",
    created: "27 de Octubre, 2024",
    expired: "25 de Abril, 2025",
    status: "Activo",
    logo: "S",
    logoBg: "bg-slate-800",
  },
  {
    id: 2,
    title: "Coordinador de Reclutamiento",
    company: "Segment",
    location: "Londres, RU",
    applications: "15+ Postulados",
    created: "25 de Octubre, 2024",
    expired: "23 de Abril, 2025",
    status: "Activo",
    logo: "R",
    logoBg: "bg-indigo-600",
  },
  {
    id: 3,
    title: "Gerente de Producto, Studio",
    company: "Segment",
    location: "Londres, RU",
    applications: "23+ Postulados",
    created: "20 de Octubre, 2024",
    expired: "18 de Abril, 2025",
    status: "Activo",
    logo: "in",
    logoBg: "bg-pink-600",
  },
  {
    id: 4,
    title: "Diseñador de Producto Senior",
    company: "Segment",
    location: "Londres, RU",
    applications: "8+ Postulados",
    created: "15 de Octubre, 2024",
    expired: "13 de Abril, 2025",
    status: "Activo",
    logo: "up",
    logoBg: "bg-green-500",
  },
  {
    id: 5,
    title: "Desarrollador Full Stack",
    company: "Segment",
    location: "Madrid, ES",
    applications: "12+ Postulados",
    created: "10 de Octubre, 2024",
    expired: "10 de Abril, 2025",
    status: "Activo",
    logo: "FS",
    logoBg: "bg-blue-600",
  },
  {
    id: 6,
    title: "Analista de Datos",
    company: "Segment",
    location: "Barcelona, ES",
    applications: "5+ Postulados",
    created: "05 de Octubre, 2024",
    expired: "05 de Abril, 2025",
    status: "Cerrado",
    logo: "DA",
    logoBg: "bg-purple-600",
  },
  {
    id: 7,
    title: "Especialista en Marketing Digital",
    company: "Segment",
    location: "Valencia, ES",
    applications: "20+ Postulados",
    created: "01 de Octubre, 2024",
    expired: "01 de Abril, 2025",
    status: "Activo",
    logo: "M",
    logoBg: "bg-orange-500",
  },
  {
    id: 8,
    title: "Gerente de Ventas",
    company: "Segment",
    location: "Bilbao, ES",
    applications: "8+ Postulados",
    created: "28 de Septiembre, 2024",
    expired: "28 de Marzo, 2025",
    status: "Activo",
    logo: "V",
    logoBg: "bg-red-600",
  },
  {
    id: 9,
    title: "Soporte Técnico",
    company: "Segment",
    location: "Sevilla, ES",
    applications: "40+ Postulados",
    created: "25 de Septiembre, 2024",
    expired: "25 de Marzo, 2025",
    status: "Activo",
    logo: "S",
    logoBg: "bg-teal-600",
  },
  {
    id: 10,
    title: "Diseñador UX/UI",
    company: "Segment",
    location: "Málaga, ES",
    applications: "18+ Postulados",
    created: "20 de Septiembre, 2024",
    expired: "20 de Marzo, 2025",
    status: "Expirado",
    logo: "UX",
    logoBg: "bg-indigo-500",
  },
];

export default function OfertasPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = jobs.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto px-6 mb-8">
      {/* Header */}
      <div className="mb-8 mt-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestionar Empleos</h1>
        <p className="text-gray-500">¿Listo para retomar el trabajo?</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 flex flex-col md:flex-row justify-between items-center border-b border-gray-100 gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Mis Ofertas de Empleo
          </h2>
          <div className="w-full md:w-48">
            <Select defaultValue="6months">
              <SelectTrigger className="bg-gray-50 border-gray-200">
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">Últimos 6 Meses</SelectItem>
                <SelectItem value="12months">Últimos 12 Meses</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 bg-gray-50/50 p-4 text-xs font-semibold text-primary font-bold uppercase tracking-wider border-b border-gray-100 hidden md:grid">
          <div className="col-span-12 md:col-span-5 pl-4">Título</div>
          <div className="col-span-6 md:col-span-2">Aplicaciones</div>
          <div className="col-span-6 md:col-span-2">Creado y Expira</div>
          <div className="col-span-6 md:col-span-1">Estado</div>
          <div className="col-span-6 md:col-span-2 text-right pr-4">Acción</div>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-100">
          {currentJobs.map((job) => (
            <div
              key={job.id}
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors"
            >
              {/* Title & Icon */}
              <div className="col-span-12 md:col-span-5 flex items-start gap-4 pl-4">
                <div
                  className={`w-12 h-12 ${job.logoBg} rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm`}
                >
                  {job.logo}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">
                    {job.title}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm mt-1 gap-4">
                    <span className="flex items-center gap-1">
                      <BriefcaseIcon className="w-4 h-4" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      {job.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Applications */}
              <div className="col-span-6 md:col-span-2 text-sm">
                <Link
                  href="#"
                  className="text-primary hover:text-green-600 hover:underline font-medium transition-colors"
                >
                  {job.applications}
                </Link>
              </div>

              {/* Dates */}
              <div className="col-span-6 md:col-span-2 text-sm text-gray-500 flex flex-col gap-1">
                <span>{job.created}</span>
                <span>{job.expired}</span>
              </div>

              {/* Status */}
              <div className="col-span-6 md:col-span-1">
                <span
                  className={`text-sm font-medium ${job.status === "Activo" ? "text-green-600" : job.status === "Expirado" ? "text-red-500" : "text-gray-500"}`}
                >
                  {job.status}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-6 md:col-span-2 flex justify-end gap-2 pr-4">
                {/* View */}
                <button
                  className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
                  title="Ver Detalle"
                >
                  <EyeIcon className="w-3 h-3" />
                </button>

                {/* Edit */}
                <button
                  className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
                  title="Editar"
                >
                  <EditIcon className="w-3 h-3" />
                </button>

                {/* Delete */}
                <button
                  className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
                  title="Eliminar"
                >
                  <TrashIcon className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Mostrando {startIndex + 1} a{" "}
            {Math.min(startIndex + itemsPerPage, jobs.length)} de {jobs.length}{" "}
            empleos
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-200 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-200 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
