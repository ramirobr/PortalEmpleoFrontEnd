"use client";

import { Button } from "@/components/ui/button";

import {
  Briefcase,
  Download,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  CheckCircle2,
  Globe,
  Github,
  Linkedin,
} from "lucide-react";
import Image from "next/image";

export default function PublicProfilePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="h-32 bg-teal-500/10 w-full relative">
          {/* Optional pattern or gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(#14aa9f_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
        </div>
        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6 gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                {/* Placeholder Avatar */}
                {/* Using a generic avatar image or Next.js Image if available */}
                <Image
                  src="/avatars/user.png" // Fallback or need a real asset. I'll use a placeholder div if image fails or generic text.
                  alt="Juan Pérez"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback logic if needed, but for server side render we can't easily attach onError.
                    // I will use a reliable placeholder service or expected local asset.
                    // Assuming /logos/logo-empresa.jpg exists, maybe avatars exist?
                    // I'll leave basic src but style it so if it breaks it's not ugly.
                    e.currentTarget.style.display = "none";
                  }}
                />
                {/* Code to simulating the image in the design - I'll assume I don't have the exact file, so I'll put a placeholder color if image is missing? 
                     Actually, I'll simply use a standard placeholder from a UI library or just a colored div if src is empty. 
                     For now, sticking to Next Image. 
                 */}
              </div>
            </div>

            <div className="flex-1 mt-2 md:mt-0">
              <h1 className="text-3xl font-bold text-gray-900">Juan Pérez</h1>
              <div className="flex flex-wrap items-center gap-2 text-gray-600 mt-1">
                <span className="font-medium text-teal-600">
                  Desarrollador Full Stack Senior
                </span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>Madrid, España</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto">
              <Button
                variant="outline"
                className="flex-1 md:flex-none gap-2 border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                <Download size={18} />
                Descargar CV
              </Button>
              <Button className="flex-1 md:flex-none gap-2 bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-200">
                <Mail size={18} />
                Contactar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Experience Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className="text-teal-600" size={24} />
              <h2 className="text-xl font-bold text-teal-600">
                Experiencia Laboral
              </h2>
            </div>

            <div className="relative space-y-12">
              {/* Timeline Line */}
              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-200"></div>

              {/* Item 1 */}
              <div className="relative pl-10">
                <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-white bg-teal-500 shadow-sm"></div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Senior Software Engineer
                    </h3>
                    <p className="font-medium text-teal-600">
                      TechSolutions Global
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap">
                    Ene 2021 - Presente
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Liderazgo técnico en el desarrollo de arquitecturas basadas en
                  microservicios utilizando Node.js y React. Optimización de
                  procesos CI/CD y mentoría de desarrolladores junior. Mejora
                  del rendimiento de la plataforma en un 35%.
                </p>
              </div>

              {/* Item 2 */}
              <div className="relative pl-10">
                <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-white bg-gray-300"></div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Desarrollador Full Stack
                    </h3>
                    <p className="font-medium text-teal-600">
                      Innovación Digital S.A.
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap">
                    Jun 2018 - Dic 2020
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Desarrollo de aplicaciones web escalables. Implementación de
                  nuevas funcionalidades frontend y diseño de APIs REST
                  robustas. Colaboración estrecha con el equipo de producto para
                  definir requisitos técnicos.
                </p>
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="text-teal-600" size={24} />
              <h2 className="text-xl font-bold text-teal-600">Educación</h2>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 text-teal-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    Grado en Ingeniería Informática
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Universidad Politécnica • 2014 - 2018
                  </p>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full ml-16"></div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 text-teal-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    Master en Arquitecturas Cloud
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Cloud Academy Online • 2019 - 2020
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Languages Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Languages className="text-teal-600" size={24} />
              <h2 className="text-xl font-bold text-teal-600">Idiomas</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 flex items-center justify-between border border-gray-100">
                <div>
                  <h4 className="font-bold text-gray-900">Español</h4>
                  <p className="text-xs font-bold text-teal-600 uppercase">
                    Nativo
                  </p>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-1.5 rounded-full bg-teal-500"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 flex items-center justify-between border border-gray-100">
                <div>
                  <h4 className="font-bold text-gray-900">Inglés</h4>
                  <p className="text-xs font-bold text-teal-600 uppercase">
                    C1 - Avanzado
                  </p>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-1.5 rounded-full bg-teal-500"
                    ></div>
                  ))}
                  <div className="w-6 h-1.5 rounded-full bg-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4 text-teal-600 font-bold">
              <div className="p-1.5 bg-teal-50 rounded-lg">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3>Resumen</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Apasionado por crear soluciones tecnológicas eficientes y
              escalables. Con más de 6 años de experiencia en el ecosistema
              JavaScript, me especializo en construir productos de alta calidad
              que generen impacto real en el usuario. Enfocado en código limpio,
              arquitectura de software y metodologías ágiles.
            </p>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4 text-teal-600 font-bold">
              <div className="p-1.5 bg-teal-50 rounded-lg">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3>Habilidades principales</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "React.js",
                "Node.js",
                "TypeScript",
                "Tailwind CSS",
                "Next.js",
                "MongoDB",
                "PostgreSQL",
                "Docker",
                "AWS",
                "Git",
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-lg border border-teal-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">
              Redes Profesionales
            </h3>
            <div className="space-y-4">
              <a
                href="#"
                className="flex items-center gap-3 text-sm text-gray-600 hover:text-teal-600 transition-colors"
              >
                <Linkedin size={18} />
                <span>linkedin.com/in/juanperez</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-sm text-gray-600 hover:text-teal-600 transition-colors"
              >
                <Github size={18} />
                <span>github.com/juanperez-dev</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-sm text-gray-600 hover:text-teal-600 transition-colors"
              >
                <Globe size={18} />
                <span>juanperez.dev</span>
              </a>
            </div>
          </div>

          {/* Status */}
          <div className="bg-teal-50/50 rounded-2xl border border-teal-100 p-6">
            <div className="flex items-center gap-2 mb-3 text-teal-600 font-bold">
              <CheckCircle2 size={20} className="fill-teal-100" />
              <h3>Estado de búsqueda</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Juan está actualmente abierto a nuevas oportunidades de trabajo en
              remoto o presencial en Madrid.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse"></span>
              ACTIVO AHORA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
