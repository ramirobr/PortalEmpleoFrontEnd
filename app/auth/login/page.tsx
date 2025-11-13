import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar
        showAuthLinks={false}
        showCompanyRegister={true}
        hideMainMenu={true}
      />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mb-8">
          Ingresa a tu cuenta
        </h1>
        <div className="w-full max-w-md bg-white rounded-lg p-6 flex flex-col gap-6 shadow-md">
          <button className="flex items-center justify-center gap-2 w-full py-3 rounded bg-white border border-gray-300 font-semibold text-base text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2">
            <Image
              src="/logos/google.svg"
              alt="Google"
              width={24}
              height={24}
            />
            Acceder con Google
          </button>
          <button className="flex items-center justify-center gap-2 w-full py-3 rounded bg-[#2867B2] text-white font-semibold text-base hover:bg-[#205081] focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2">
            <Image
              src="/logos/linkedin.svg"
              alt="LinkedIn"
              width={24}
              height={24}
            />
            Acceder con Linkedin
          </button>
          <div className="flex items-center my-2">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-2 text-gray-400">o</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          <form className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.879 1.795l-7.5 5.625a2.25 2.25 0 01-2.742 0l-7.5-5.625A2.25 2.25 0 012.25 6.993V6.75"
                    />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full border rounded px-10 py-2"
                  placeholder="Ingresa tu email"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block font-medium mb-1">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75A2.25 2.25 0 0014.25 4.5h-4.5A2.25 2.25 0 007.5 6.75v13.5A2.25 2.25 0 009.75 22.5h4.5A2.25 2.25 0 0016.5 20.25V16.5"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9.75h4.5M9.75 13.5h2.25"
                    />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full border rounded px-10 py-2 pr-10"
                  placeholder="Ingresa tu contraseña"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18M4.5 4.5l15 15"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/forgot-password"
                className="text-primary font-semibold text-sm mb-2 hover:underline"
              >
                Olvidé mi contraseña
              </Link>
              <button
                type="submit"
                className="w-full py-3 rounded bg-gray-300 text-white font-semibold text-lg cursor-not-allowed"
                disabled
              >
                Ingresar
              </button>
            </div>
            <div className="text-center mt-4 text-sm">
              ¿No tienes cuenta?{" "}
              <Link
                href="/auth/email"
                className="text-primary font-semibold underline"
              >
                Regístrate como candidato
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
