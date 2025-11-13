import Navbar from "./shared/components/Navbar";
import Footer from "./shared/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-16">
        <h1 className="text-4xl font-bold mb-2 text-primary">
          Portal de Empleo
        </h1>
        <p className="text-lg mb-8 text-gray-600 max-w-xl text-center">
          Explora miles de ofertas laborales, filtra por ubicación, experiencia,
          empresa y más. ¡Comienza tu búsqueda ahora!
        </p>
        <a
          href="/empleos-busqueda"
          className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        >
          Ver Ofertas de Trabajo
        </a>
      </main>
      <Footer />
    </div>
  );
}
