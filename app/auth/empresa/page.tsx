import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";

export default function CompanyRegister() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar
        showAuthLinks={false}
        showCompanyRegister={false}
        hideMainMenu={true}
        showBuscarEmpleos={true}
      />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">
          Registra tu empresa
        </h1>
        <p className="text-xs text-gray-600 mb-2">
          Todos los campos con <span className="text-red-500">*</span> son
          obligatorios.
        </p>
        <form
          className="w-full max-w-3xl bg-white rounded-lg p-6 flex flex-col gap-6 shadow-md"
          autoComplete="off"
        >
          <fieldset className="border-0 p-0">
            <legend className="sr-only">Datos de la empresa</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="company-name"
                  className="block font-medium mb-1"
                >
                  Nombre de la empresa <span className="text-red-500">*</span>
                </label>
                <input
                  id="company-name"
                  name="company-name"
                  type="text"
                  className="w-full border rounded px-4 py-2"
                  placeholder=""
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="razon-social"
                  className="block font-medium mb-1"
                >
                  Razón social <span className="text-red-500">*</span>
                </label>
                <input
                  id="razon-social"
                  name="razon-social"
                  type="text"
                  className="w-full border rounded px-4 py-2"
                  placeholder=""
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="condicion-fiscal"
                  className="block font-medium mb-1"
                >
                  Condición fiscal <span className="text-red-500">*</span>
                </label>
                <select
                  id="condicion-fiscal"
                  name="condicion-fiscal"
                  className="w-full border rounded px-4 py-2"
                  required
                >
                  <option value="">Seleccione una opción</option>
                  <option value="responsable">Responsable Inscripto</option>
                  <option value="monotributo">Monotributo</option>
                  <option value="exento">Exento</option>
                </select>
              </div>
              <div>
                <label htmlFor="documento" className="block font-medium mb-1">
                  Documento <span className="text-red-500">*</span>
                </label>
                <input
                  id="documento"
                  name="documento"
                  type="text"
                  className="w-full border rounded px-4 py-2"
                  placeholder="Ingresar solo números, sin guiones."
                  required
                />
              </div>
              <div>
                <label htmlFor="provincia" className="block font-medium mb-1">
                  Provincia <span className="text-red-500">*</span>
                </label>
                <select
                  id="provincia"
                  name="provincia"
                  className="w-full border rounded px-4 py-2"
                  required
                >
                  <option value="">Seleccione una opción</option>
                  <option value="azuay">Azuay</option>
                  <option value="bolivar">Bolívar</option>
                  <option value="canar">Cañar</option>
                  <option value="carchi">Carchi</option>
                  <option value="chimborazo">Chimborazo</option>
                  <option value="cotopaxi">Cotopaxi</option>
                  <option value="el-oro">El Oro</option>
                  <option value="esmeraldas">Esmeraldas</option>
                  <option value="galapagos">Galápagos</option>
                  <option value="guayas">Guayas</option>
                  <option value="imbabura">Imbabura</option>
                  <option value="loja">Loja</option>
                  <option value="los-rios">Los Ríos</option>
                  <option value="manabi">Manabí</option>
                  <option value="morona-santiago">Morona Santiago</option>
                  <option value="napo">Napo</option>
                  <option value="orellana">Orellana</option>
                  <option value="pastaza">Pastaza</option>
                  <option value="pichincha">Pichincha</option>
                  <option value="santa-elena">Santa Elena</option>
                  <option value="santo-domingo">Santo Domingo</option>
                  <option value="sucumbios">Sucumbíos</option>
                  <option value="tungurahua">Tungurahua</option>
                  <option value="zamora-chinchipe">Zamora Chinchipe</option>
                </select>
              </div>
              <div>
                <label htmlFor="calle" className="block font-medium mb-1">
                  Calle <span className="text-red-500">*</span>
                </label>
                <input
                  id="calle"
                  name="calle"
                  type="text"
                  className="w-full border rounded px-4 py-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="numero" className="block font-medium mb-1">
                  Numero <span className="text-red-500">*</span>
                </label>
                <input
                  id="numero"
                  name="numero"
                  type="text"
                  className="w-full border rounded px-4 py-2"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="codigo-postal"
                  className="block font-medium mb-1"
                >
                  Codigo Postal <span className="text-red-500">*</span>
                </label>
                <input
                  id="codigo-postal"
                  name="codigo-postal"
                  type="text"
                  className="w-full border rounded px-4 py-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="telefono" className="block font-medium mb-1">
                  Teléfono <span className="text-red-500">*</span>
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
                    placeholder=""
                    required
                  />
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  Ej. 991234567
                </span>
              </div>
              <div>
                <label htmlFor="industria" className="block font-medium mb-1">
                  Industria <span className="text-red-500">*</span>
                </label>
                <select
                  id="industria"
                  name="industria"
                  className="w-full border rounded px-4 py-2"
                  required
                >
                  <option value="">Seleccione una opción</option>
                  <option value="tecnologia">Tecnología</option>
                  <option value="salud">Salud</option>
                  <option value="educacion">Educación</option>
                  <option value="comercio">Comercio</option>
                  <option value="servicios">Servicios</option>
                  <option value="manufactura">Manufactura</option>
                  <option value="finanzas">Finanzas</option>
                  <option value="construccion">Construcción</option>
                  <option value="agropecuaria">Agropecuaria</option>
                  <option value="otra">Otra</option>
                </select>
              </div>
              <div>
                <label htmlFor="empleados" className="block font-medium mb-1">
                  Cantidad de empleados <span className="text-red-500">*</span>
                </label>
                <select
                  id="empleados"
                  name="empleados"
                  className="w-full border rounded px-4 py-2"
                  required
                >
                  <option value="">Seleccione una opción</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
            </div>
          </fieldset>
          <fieldset className="border-0 p-0">
            <legend className="sr-only">Información de usuario</legend>
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
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email-usuario"
                  className="block font-medium mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email-usuario"
                  name="email-usuario"
                  type="email"
                  className="w-full border rounded px-4 py-2"
                  required
                />
                <span className="text-xs text-gray-500">
                  A este mail se van a enviar las facturas de compra.
                </span>
              </div>
              <div>
                <label htmlFor="password" className="block font-medium mb-1">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="w-full border rounded px-4 py-2 pr-10"
                    required
                    minLength={7}
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
                  <span className="text-xs text-gray-500 block mt-1">
                    Debe tener 7 dígitos como mínima.
                  </span>
                </div>
              </div>
              <div>
                <label
                  htmlFor="repeat-password"
                  className="block font-medium mb-1"
                >
                  Repetir contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  id="repeat-password"
                  name="repeat-password"
                  type="password"
                  className="w-full border rounded px-4 py-2"
                  required
                  minLength={7}
                />
              </div>
            </div>
          </fieldset>
          <div className="flex flex-col gap-2 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                required
                className="accent-primary"
                id="terms"
                aria-label="Acepto los Términos y Condiciones, Política de Privacidad, Condiciones de contratación, Política de Cookies, Solicitud de Ayuda."
              />
              <span className="text-sm">
                Acepto los{" "}
                <a
                  href="/terms"
                  className="text-primary font-semibold underline"
                >
                  Términos y Condiciones
                </a>
                ,{" "}
                <a
                  href="/privacy"
                  className="text-primary font-semibold underline"
                >
                  Política de Privacidad
                </a>
                ,{" "}
                <a
                  href="/contract"
                  className="text-primary font-semibold underline"
                >
                  Condiciones de contratación
                </a>
                ,{" "}
                <a
                  href="/cookies"
                  className="text-primary font-semibold underline"
                >
                  Política de Cookies
                </a>
                ,{" "}
                <a
                  href="/help"
                  className="text-primary font-semibold underline"
                >
                  Solicitud de Ayuda
                </a>
                .<span className="text-red-500">*</span>
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-primary"
                id="newsletter"
                aria-label="Quiero recibir newsletters con novedades, promociones y actualizaciones."
              />
              <span className="text-sm">
                Quiero recibir newsletters con novedades, promociones y
                actualizaciones.
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-primary"
                id="encuestas"
                aria-label="Quiero participar en encuestas y pruebas piloto para ayudar a mejorar la plataforma."
              />
              <span className="text-sm">
                Quiero participar en encuestas y pruebas piloto para ayudar a
                mejorar la plataforma.
              </span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full mt-4 py-3 rounded bg-gray-300 text-white font-semibold text-lg cursor-not-allowed"
            aria-label="Crear cuenta empresa"
            disabled
          >
            Crear cuenta empresa
          </button>
          <div className="text-center mt-4 text-sm">
            ¿Ya tienes cuenta?{" "}
            <a href="/signin" className="text-primary font-semibold underline">
              Ingresa a tu cuenta empresa
            </a>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
