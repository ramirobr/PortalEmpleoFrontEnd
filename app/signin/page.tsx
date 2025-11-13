import Navbar from "../shared/components/Navbar";
import Footer from "../shared/components/Footer";

export default function SignIn() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mb-8">
          Crea tu cuenta y comienza a buscar empleo
        </h1>
        <div className="w-full max-w-md flex flex-col gap-4">
          <a
            href="/auth/google"
            className="flex items-center gap-2 px-4 py-3 rounded border border-gray-300 bg-blue-500 text-white font-medium text-lg shadow hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span className="text-2xl bg-white rounded-full p-1">🌐</span>
            Acceder con Google
          </a>
          <a
            href="/auth/linkedin"
            className="flex items-center gap-2 px-4 py-3 rounded border border-gray-300 bg-blue-700 text-white font-medium text-lg shadow hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span className="text-2xl bg-white rounded-full p-1 text-blue-700">
              in
            </span>
            Acceder con Linkedin
          </a>
          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="mx-4 text-gray-500 font-semibold">o</span>
            <hr className="flex-1 border-gray-300" />
          </div>
          <a
            href="/auth/email"
            className="flex items-center gap-2 px-4 py-3 rounded border border-gray-300 bg-white text-gray-800 font-medium text-lg shadow hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span className="text-2xl">✉️</span>
            Continuar con correo electrónico
          </a>
        </div>
        {/*
        <div className="mt-8 text-center">
          <p className="font-semibold mb-2">¡Descarga la app en tu celular!</p>
          <div className="flex justify-center gap-4 mb-4">
            <a href="https://play.google.com/store" aria-label="Google Play">
              <img
                src="/badges/google-play-badge.png"
                alt="Disponible en Google Play"
                className="h-12"
              />
            </a>
            <a href="https://www.apple.com/app-store/" aria-label="App Store">
              <img
                src="/badges/app-store-badge.png"
                alt="Consíguelo en App Store"
                className="h-12"
              />
            </a>
          </div>
          <div className="flex justify-center gap-6 text-2xl text-gray-400 mt-4">
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="hover:text-primary"
            >
              Facebook
            </a>
            <a
              href="https://tiktok.com"
              aria-label="TikTok"
              className="hover:text-primary"
            >
              TikTok
            </a>
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="hover:text-primary"
            >
              Instagram
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              className="hover:text-primary"
            >
              LinkedIn
            </a>
            <a
              href="https://youtube.com"
              aria-label="YouTube"
              className="hover:text-primary"
            >
              YouTube
            </a>
          </div>
        </div>
        */}
        <footer className="w-full mt-12 text-center text-xs text-gray-500 border-t border-gray-200 pt-6">
          <div className="mb-2">
            Términos y Condiciones de uso – Política de protección de datos
            personales y privacidad – Términos y condiciones generales de
            contratación – Política de cookies –
          </div>
          <div>Preguntas frecuentes – Ofertas de Empleo</div>
        </footer>
      </main>
      <Footer />
    </div>
  );
}
