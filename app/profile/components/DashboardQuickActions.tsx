"use client";

import { Contact2, MapPin, User, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardQuickActions() {
  const cards = [
    {
      title: "Tu información",
      description: "Nombre y datos de identificación",
      icon: <Contact2 className="w-8 h-8 text-primary" />,
      alert: true,
      link: "/profile/edit#datosPersonales",
    },
    {
      title: "Dirección",
      description:
        "Dirección de domicilio. Verifícala con una imagen de tu servicio básico",
      icon: <MapPin className="w-8 h-8 text-primary" />,
      alert: true,
      link: "/profile/edit#planillaServicio",
    },
    {
      title: "Certificados",
      description:
        "Actualiza todos tus certificados laborales: Antecedentes, médicos y demás",
      icon: <User className="w-8 h-8 text-primary" />,
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
          className="bg-white rounded-3xl shadow-sm overflow-hidden flex relative min-h-[160px] group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer no-underline border border-slate-50"
        >
          <div className="flex-1 p-8 relative">
            {/* Icons row */}
            <div className="flex justify-between items-start mb-6">
              {card.icon}
              {card.alert && (
                <div className="bg-warning rounded-full p-0.5">
                  <AlertCircle className="w-5 h-5 text-white fill-warning" />
                </div>
              )}
            </div>

            {/* Text content */}
            <div>
              <h3 className="text-xl font-display font-black text-primary mb-2 uppercase tracking-tight group-hover:text-primary-container transition-colors duration-300">
                {card.title}
              </h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
