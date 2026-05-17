import MainLayout from "@/components/shared/layout/MainLayout";
import Footer from "@/components/shared/components/Footer";

export const metadata = {
  title: "Términos y Condiciones | Portal Empleo",
  description:
    "Conoce los términos y condiciones de uso del Portal de Empleo.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-zinc-900 mb-3">{title}</h2>
      <div className="text-zinc-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-zinc-50">
        <div className="bg-gradient-to-br from-primary to-primary-deep py-14 text-white">
          <div className="container text-center">
            <h1 className="text-4xl font-semibold mb-3">Términos y Condiciones</h1>
            <p className="text-white/80 text-base max-w-xl mx-auto">
              Por favor lee detenidamente estos términos antes de utilizar el portal.
            </p>
          </div>
        </div>

        <div className="container py-12 max-w-3xl">
          <p className="text-sm text-zinc-400 mb-8">Última actualización: enero 2025</p>

          <Section title="1. Aceptación de los términos">
            <p>
              Al acceder y utilizar Portal Empleo (en adelante, "el Portal"), aceptas quedar
              vinculado por los presentes Términos y Condiciones, así como por todas las leyes y
              regulaciones aplicables en la República del Ecuador. Si no estás de acuerdo con
              alguno de estos términos, se te prohíbe el uso de este sitio.
            </p>
          </Section>

          <Section title="2. Uso del portal">
            <p>
              El Portal está destinado a conectar a empresas con candidatos en búsqueda de empleo.
              Las empresas pueden publicar ofertas laborales y los candidatos pueden postularse a
              las mismas. Cualquier uso fraudulento, ilegal o contrario a las buenas costumbres
              queda expresamente prohibido.
            </p>
            <p>
              Queda prohibido publicar ofertas de empleo falsas, discriminatorias o que vulneren
              los derechos laborales reconocidos por el Código de Trabajo ecuatoriano.
            </p>
          </Section>

          <Section title="3. Registro y cuentas de usuario">
            <p>
              Para acceder a determinadas funcionalidades deberás crear una cuenta. Eres
              responsable de mantener la confidencialidad de tus credenciales y de todas las
              actividades que se realicen bajo tu cuenta. Notifica de inmediato cualquier uso no
              autorizado a nuestro equipo de soporte.
            </p>
          </Section>

          <Section title="4. Contenido publicado">
            <p>
              Al publicar ofertas de empleo, currículums o cualquier otro contenido en el Portal,
              otorgas a Portal Empleo una licencia no exclusiva para mostrar dicho contenido en la
              plataforma. Garantizas que tienes los derechos necesarios sobre el contenido que
              publicas y que este no infringe derechos de terceros.
            </p>
          </Section>

          <Section title="5. Propiedad intelectual">
            <p>
              El diseño, código fuente, marcas, logotipos y demás elementos del Portal son
              propiedad de Portal Empleo o de sus respectivos titulares. Queda prohibida su
              reproducción total o parcial sin autorización expresa por escrito.
            </p>
          </Section>

          <Section title="6. Limitación de responsabilidad">
            <p>
              Portal Empleo actúa como intermediario y no es parte en la relación laboral entre
              empresas y candidatos. No garantizamos la veracidad, exactitud o actualidad de las
              ofertas publicadas. El Portal no será responsable por daños derivados del uso o la
              imposibilidad de uso del servicio.
            </p>
          </Section>

          <Section title="7. Modificaciones">
            <p>
              Nos reservamos el derecho de modificar estos Términos en cualquier momento. Los
              cambios entrarán en vigor en el momento de su publicación. El uso continuado del
              Portal tras la publicación de cambios implica la aceptación de los mismos.
            </p>
          </Section>

          <Section title="8. Legislación aplicable">
            <p>
              Los presentes Términos se rigen por las leyes de la República del Ecuador. Cualquier
              controversia será sometida a los tribunales competentes de la ciudad de Quito.
            </p>
          </Section>

          <p className="text-sm text-zinc-400 mt-10">
            Para consultas sobre estos términos escríbenos a{" "}
            <a href="mailto:info@portalempleo.ec" className="text-primary underline">
              info@portalempleo.ec
            </a>
            .
          </p>
        </div>
      </div>
      <Footer />
    </MainLayout>
  );
}
