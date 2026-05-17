import MainLayout from "@/components/shared/layout/MainLayout";
import Footer from "@/components/shared/components/Footer";

export const metadata = {
  title: "Política de Cookies | Portal Empleo",
  description:
    "Información sobre el uso de cookies en Portal Empleo y cómo gestionarlas.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-zinc-900 mb-3">{title}</h2>
      <div className="text-zinc-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

type CookieRow = { nombre: string; tipo: string; duracion: string; proposito: string };

function CookieTable({ rows }: { rows: CookieRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 mt-4">
      <table className="w-full text-sm text-left">
        <thead className="bg-zinc-50 text-zinc-700 font-semibold">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Duración</th>
            <th className="px-4 py-3">Propósito</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {rows.map((row) => (
            <tr key={row.nombre} className="bg-white">
              <td className="px-4 py-3 font-mono text-xs">{row.nombre}</td>
              <td className="px-4 py-3">{row.tipo}</td>
              <td className="px-4 py-3">{row.duracion}</td>
              <td className="px-4 py-3">{row.proposito}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiesPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-zinc-50">
        <div className="bg-gradient-to-br from-primary to-primary-deep py-14 text-white">
          <div className="container text-center">
            <h1 className="text-4xl font-semibold mb-3">Política de Cookies</h1>
            <p className="text-white/80 text-base max-w-xl mx-auto">
              Información sobre cómo utilizamos cookies y tecnologías similares en el Portal.
            </p>
          </div>
        </div>

        <div className="container py-12 max-w-3xl">
          <p className="text-sm text-zinc-400 mb-8">Última actualización: enero 2025</p>

          <Section title="¿Qué son las cookies?">
            <p>
              Las cookies son pequeños archivos de texto que los sitios web almacenan en tu
              dispositivo cuando los visitas. Permiten que el sitio recuerde tus preferencias,
              mantenga tu sesión iniciada y mejore tu experiencia de navegación en general.
            </p>
          </Section>

          <Section title="Cookies que utilizamos">
            <p>Portal Empleo utiliza los siguientes tipos de cookies:</p>

            <h3 className="font-semibold text-zinc-800 mt-4 mb-1">Cookies estrictamente necesarias</h3>
            <p>
              Son imprescindibles para el funcionamiento del Portal. Sin ellas no podrías
              navegar ni usar funciones básicas como iniciar sesión.
            </p>
            <CookieTable
              rows={[
                {
                  nombre: "next-auth.session-token",
                  tipo: "Sesión",
                  duracion: "Al cerrar sesión",
                  proposito: "Mantiene la sesión autenticada del usuario.",
                },
                {
                  nombre: "next-auth.csrf-token",
                  tipo: "Seguridad",
                  duracion: "Al cerrar sesión",
                  proposito: "Protege contra ataques CSRF.",
                },
              ]}
            />

            <h3 className="font-semibold text-zinc-800 mt-6 mb-1">Cookies de preferencias</h3>
            <p>
              Permiten que el Portal recuerde información que cambia el aspecto o el
              comportamiento del sitio, como tu idioma preferido.
            </p>
            <CookieTable
              rows={[
                {
                  nombre: "pe_prefs",
                  tipo: "Preferencias",
                  duracion: "1 año",
                  proposito: "Guarda ajustes de visualización y preferencias del usuario.",
                },
              ]}
            />

            <h3 className="font-semibold text-zinc-800 mt-6 mb-1">Cookies analíticas</h3>
            <p>
              Nos ayudan a entender cómo los visitantes interactúan con el Portal, lo que nos
              permite mejorar su funcionamiento. Los datos se recopilan de forma anónima y
              agregada.
            </p>
            <CookieTable
              rows={[
                {
                  nombre: "_ga",
                  tipo: "Analítica",
                  duracion: "2 años",
                  proposito: "Identifica sesiones únicas de usuario (Google Analytics).",
                },
                {
                  nombre: "_ga_*",
                  tipo: "Analítica",
                  duracion: "2 años",
                  proposito: "Mantiene el estado de sesión de Google Analytics.",
                },
              ]}
            />
          </Section>

          <Section title="Cómo gestionar las cookies">
            <p>
              Puedes controlar y/o eliminar las cookies cuando lo desees. La mayoría de los
              navegadores te permiten rechazar cookies o te avisan cuando se intenta instalar una.
              Consulta la ayuda de tu navegador para más información:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong>Google Chrome:</strong> Configuración → Privacidad y seguridad → Cookies.
              </li>
              <li>
                <strong>Mozilla Firefox:</strong> Opciones → Privacidad y Seguridad.
              </li>
              <li>
                <strong>Safari:</strong> Preferencias → Privacidad.
              </li>
              <li>
                <strong>Microsoft Edge:</strong> Configuración → Cookies y permisos del sitio.
              </li>
            </ul>
            <p>
              Ten en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad del
              Portal, incluyendo la imposibilidad de iniciar sesión.
            </p>
          </Section>

          <Section title="Actualizaciones de esta política">
            <p>
              Podemos actualizar esta Política de Cookies para reflejar cambios en las cookies
              que utilizamos o por razones operativas, legales o reglamentarias. Visita esta página
              periódicamente para mantenerte informado.
            </p>
          </Section>

          <p className="text-sm text-zinc-400 mt-10">
            Para consultas sobre el uso de cookies escríbenos a{" "}
            <a href="mailto:privacidad@portalempleo.ec" className="text-primary underline">
              privacidad@portalempleo.ec
            </a>
            .
          </p>
        </div>
      </div>
      <Footer />
    </MainLayout>
  );
}
