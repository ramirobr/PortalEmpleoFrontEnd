import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  UserRound,
  Briefcase,
  GraduationCap,
  Clock,
} from "lucide-react";

import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8">
      {/* Logo Section */}
      <div className="mb-12 sm:mb-16 flex flex-col items-center max-w-sm w-full">
        <Image
          src="/logos/logo-empresa.jpg"
          alt="Implica - Conecta. Certifica. Crece."
          width={400}
          height={132}
          className="object-contain w-full h-auto"
          priority
        />
      </div>

      {/* Main Container for Actions */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-10 sm:gap-14">
        {/* Top Row: 2 items */}
        {!session && (
          <div className="flex flex-row flex-wrap justify-center gap-8 sm:gap-24 w-full">
            <ActionItem
              href="/auth/login"
              icon={
                <Building2 className="w-12 h-12 sm:w-14 sm:h-14 stroke-[1.5]" />
              }
              label="Soy Empresa"
            />
            <ActionItem
              href="/auth/login"
              icon={
                <UserRound className="w-12 h-12 sm:w-14 sm:h-14 stroke-[1.5]" />
              }
              label="Persona Natural"
            />
          </div>
        )}

        {/* Divider */}
        {!session && (
          <div className="w-full max-w-3xl border-t-2 border-primary/60 my-2 sm:my-4" />
        )}

        {/* Bottom Row: 3 items */}
        <div className="flex flex-row flex-wrap justify-center gap-8 sm:gap-16 w-full">
          <ActionItem
            href="/empleos-busqueda"
            icon={
              <Briefcase className="w-12 h-12 sm:w-14 sm:h-14 stroke-[1.5]" />
            }
            label="Busco Empleo"
          />
          <ActionItem
            href="/empleos-busqueda/email?role=pasante"
            icon={
              <GraduationCap className="w-12 h-12 sm:w-14 sm:h-14 stroke-[1.5]" />
            }
            label="Soy Pasante"
          />
          <ActionItem
            href="/empleos-busqueda/email?role=horas"
            icon={<Clock className="w-12 h-12 sm:w-14 sm:h-14 stroke-[1.5]" />}
            label="Trabajo por horas"
          />
        </div>
      </div>
    </main>
  );
}

function ActionItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-4 group w-32 sm:w-40 focus:outline-none focus-visible:ring-4 focus-visible:ring-secondary focus-visible:ring-offset-4 rounded-xl p-2"
    >
      <div className="w-24 h-24 sm:w-[120px] sm:h-[120px] rounded-full bg-secondary flex items-center justify-center text-white shadow-md transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-white">
        {icon}
      </div>
      <span className="text-secondary font-bold text-center text-base sm:text-lg leading-tight">
        {label}
      </span>
    </Link>
  );
}
