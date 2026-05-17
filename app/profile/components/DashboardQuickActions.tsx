"use client";

import { Contact2, MapPin, User, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardQuickActions() {
  const cards = [
    {
      title: "Tu información",
      description: "Nombre y datos de identificación",
      icon: <Contact2 className="size-8 text-primary" />,
      alert: true,
      link: "/profile/edit#datosPersonales",
    },
    {
      title: "Dirección",
      description:
        "Dirección de domicilio. Verifícala con una imagen de tu servicio básico",
      icon: <MapPin className="size-8 text-primary" />,
      alert: true,
      link: "/profile/edit#planillaServicio",
    },
    {
      title: "Certificados",
      description:
        "Actualiza todos tus certificados laborales: Antecedentes, médicos y demás",
      icon: <User className="size-8 text-primary" />,
      alert: true,
      link: "/profile/edit#certificados",
    },
  ];

  return (
    <section className="mb-12" aria-label="Acciones rápidas de perfil">
      <ul className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <li key={index}>
            <Link
              href={card.link}
              className="bg-white rounded-3xl shadow-sm overflow-hidden flex relative min-h-[160px] group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer no-underline border border-zinc-50 outline-none focus-visible:ring-4 focus-visible:ring-primary/20 h-full"
              aria-label={`Editar ${card.title}: ${card.description}`}
            >
              <div className="flex-1 p-8 relative">
                {/* Icons row */}
                <div className="flex justify-between items-start mb-6">
                  <div aria-hidden="true">{card.icon}</div>
                  {card.alert && (
                    <div className="bg-warning rounded-full p-0.5" role="status" aria-label="Requiere atención">
                      <AlertCircle className="size-5 text-white fill-warning" aria-hidden="true" />
                    </div>
                  )}
                </div>

                {/* Text content */}
                <div>
                  <h3 className="text-xl font-display font-semibold text-primary mb-2 uppercase tracking-tight group-hover:text-secondary transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
