import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";

export default function EmailSignup() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar
        showAuthLinks={false}
        showCompanyRegister={true}
        hideMainMenu={true}
      />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mb-8">
          Crea tu cuenta y encuentra tu empleo ideal
        </h1>
        <form
          className="w-full max-w-2xl bg-white rounded-lg p-6 flex flex-col gap-6 shadow-md"
          autoComplete="off"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block font-medium mb-1">
                Nombre(s) <span className="text-red-500">*</span>
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                className="w-full border rounded px-4 py-2"
                placeholder="Ingresa tu nombre"
                required
              />
            </div>
            <div>
              <label htmlFor="apellido" className="block font-medium mb-1">
                Apellido(s) <span className="text-red-500">*</span>
              </label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                className="w-full border rounded px-4 py-2"
                placeholder="Ingresa tu apellido"
                required
              />
            </div>
            <div className="col-span-1 md:col-span-2 flex gap-4">
              <div className="w-1/2">
                <label htmlFor="tipo-doc" className="block font-medium mb-1">
                  Tipo de documento
                </label>
                <select
                  id="tipo-doc"
                  name="tipo-doc"
                  className="w-full border rounded px-4 py-2"
                >
                  <option value="">Tipo</option>
                  <option value="cedula">Cédula</option>
                  <option value="pasaporte">Pasaporte</option>
                </select>
              </div>
              <div className="w-1/2">
                <label htmlFor="num-doc" className="block font-medium mb-1">
                  Número
                </label>
                <input
                  id="num-doc"
                  name="num-doc"
                  type="text"
                  className="w-full border rounded px-4 py-2"
                  placeholder="Número"
                />
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 flex gap-4">
              <div className="w-1/2">
                <label htmlFor="telefono" className="block font-medium mb-1">
                  Teléfono celular <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center border rounded px-2 bg-gray-100">
                    🇪🇨 +593
                  </span>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    className="flex-1 border rounded px-4 py-2"
                    placeholder="Número"
                    required
                  />
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  Ej. 991234567
                </span>
              </div>
              <div className="w-1/2">
                <label htmlFor="password" className="block font-medium mb-1">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="w-full border rounded px-4 py-2 pr-10"
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                    tabIndex={0}
                    aria-label="Mostrar contraseña"
                  >
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
                        d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="email" className="block font-medium mb-1">
                Email <span className="text-red-500">*</span>
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
          </div>
          <div className="text-xs text-red-500 mt-2">* Campos obligatorios</div>
          <div className="flex flex-col gap-2 mt-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" required className="accent-primary" />
              <span className="text-sm">
                Acepto las{" "}
                <a href="#" className="text-primary font-semibold underline">
                  Condiciones de uso
                </a>{" "}
                <span className="text-red-500">*</span>
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-primary" />
              <span className="text-sm">
                He leído y comprendo la{" "}
                <a href="#" className="text-primary font-semibold underline">
                  Política de protección de datos personales y privacidad
                </a>{" "}
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-primary" />
              <span className="text-sm">
                Acepto recibir novedades, promociones y actualizaciones.
              </span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full mt-4 py-3 rounded bg-gray-300 text-white font-semibold text-lg cursor-not-allowed"
            disabled
          >
            Crear cuenta
          </button>
          <div className="text-center mt-4 text-sm">
            ¿Ya tienes cuenta?{" "}
            <a href="/signin" className="text-primary font-semibold underline">
              Ingresa como candidato
            </a>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
