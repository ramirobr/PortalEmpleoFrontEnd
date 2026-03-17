"use client";

import { Contact2, MapPin, User, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardQuickActions() {
  const cards = [
    {
      title: "Tu información",
      description: "Nombre y datos de identificación",
      icon: <Contact2 className="w-8 h-8 text-gray-600" />,
      alert: true,
      link: "/profile/edit#datosPersonales",
    },
    {
      title: "Dirección",
      description:
        "Dirección de domicilio. Verifícala con una imagen de tu servicio básico",
      icon: <MapPin className="w-8 h-8 text-gray-600" />,
      alert: true,
      link: "/profile/edit#planillaServicio",
    },
    {
      title: "Certificados",
      description:
        "Actualiza todos tus certificados laborales: Antecedentes, médicos y demás",
      icon: <User className="w-8 h-8 text-gray-600" />,
      alert: true,
      link: "/profile/edit#certificados",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {cards.map((card, index) => (
        <Link
          key={index}
          href={card.link}
          className="bg-white rounded-xl border border-gray-100 border-l-8 border-l-primary shadow-sm overflow-hidden flex relative min-h-[160px] group hover:shadow-md transition-shadow cursor-pointer no-underline"
        >
          <div className="flex-1 p-6 relative">
            {/* Icons row */}
            <div className="flex justify-between items-start mb-6">
              {card.icon}
              {card.alert && (
                <div className="bg-[#f2994a] rounded-full p-0.5">
                  <AlertCircle className="w-5 h-5 text-white fill-[#f2994a]" />
                </div>
              )}
            </div>

            {/* Text content */}
            <div>
              <h3 className="text-[20px] font-medium text-black mb-1">
                {card.title}
              </h3>
              <p className="text-[14px] text-black leading-tight">
                {card.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
