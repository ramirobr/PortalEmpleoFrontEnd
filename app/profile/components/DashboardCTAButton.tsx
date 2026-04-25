import Link from "next/link";

export default function DashboardCTAButton() {
  return (
    <div className="flex justify-center mt-10 mb-4">
      <Link
        href="/empleos-busqueda"
        className="bg-primary hover:bg-primary-deep text-white font-bold text-lg px-12 py-4 rounded-full shadow-md transition-colors"
      >
        ¡Buscar Ofertas Ahora!
      </Link>
    </div>
  );
}
