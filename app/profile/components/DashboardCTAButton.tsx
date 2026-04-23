import Link from "next/link";

export default function DashboardCTAButton() {
  return (
    <div className="flex justify-center mt-10 mb-4">
      <Link
        href="/empleos-busqueda"
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-12 py-4 rounded-full shadow-md transition-colors"
      >
        ¡Buscar Ofertas Ahora!
      </Link>
    </div>
  );
}
