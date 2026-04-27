"use client";

interface EmpresaStatsBannerProps {
  contrataciones: number;
  cvsRecibidos: number;
}

export default function EmpresaStatsBanner({
  contrataciones,
  cvsRecibidos,
}: EmpresaStatsBannerProps) {
  return (
    <div
      className="w-full bg-secondary flex items-center justify-center py-4 px-6 gap-8"
      role="status"
      aria-label="Estadísticas de reclutamiento"
    >
      <p className="text-white text-base lg:text-lg font-semibold tracking-wide flex items-center gap-2">
        <span className="font-bold text-xl">+{cvsRecibidos.toLocaleString()}</span>
        <strong className="font-bold">CVs Recibidos</strong>
      </p>
      <div className="w-px h-6 bg-white/20 hidden sm:block" aria-hidden="true" />
      <p className="text-white text-base lg:text-lg font-semibold tracking-wide flex items-center gap-2">
        <span className="font-bold text-xl">+{contrataciones.toLocaleString()}</span>
        <strong className="font-bold">Contrataciones Exitosas</strong>
      </p>
    </div>
  );
}
