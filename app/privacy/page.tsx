import MainLayout from "@/components/shared/layout/MainLayout";
import Footer from "@/components/shared/components/Footer";

export const metadata = {
  title: "Política de Privacidad | Portal Empleo",
  description:
    "Conoce cómo recopilamos, usamos y protegemos tus datos personales en Portal Empleo.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
      <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-primary to-primary-deep py-14 text-white">
          <div className="container text-center">
            <h1 className="text-4xl font-extrabold mb-3">Política de Privacidad</h1>
            <p className="text-white/80 text-base max-w-xl mx-auto">
              Tu privacidad es importante para nosotros. Aquí explicamos cómo manejamos tus datos.
            </p>
          </div>
        </div>

        <div className="container py-12 max-w-3xl">
          <p className="text-sm text-gray-400 mb-8">Última actualización: enero 2025</p>

          <Section title="1. Responsable del tratamiento">
            <p>
              Portal Empleo, con domicilio en la ciudad de Quito, Ecuador, es el responsable del
              tratamiento de los datos personales que recopilas a través de este sitio web, de
              conformidad con la Ley Orgánica de Protección de Datos Personales (LOPDP) del Ecuador.
            </p>
          </Section>

          <Section title="2. Datos que recopilamos">
            <p>Recopilamos los siguientes tipos de datos:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong>Datos de identificación:</strong> nombre, apellido, número de cédula o
                pasaporte, fecha de nacimiento.
              </li>
              <li>
                <strong>Datos de contacto:</strong> correo electrónico, número de teléfono,
                dirección.
              </li>
              <li>
                <strong>Datos profesionales:</strong> experiencia laboral, educación, habilidades,
                idiomas, currículum vitae.
              </li>
              <li>
                <strong>Datos de empresa:</strong> razón social, RUC, descripción, sector, logo.
              </li>
              <li>
                <strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas
                visitadas, cookies.
              </li>
            </ul>
          </Section>

          <Section title="3. Finalidad del tratamiento">
            <p>Utilizamos tus datos para:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Gestionar tu registro y cuenta en el Portal.</li>
              <li>Facilitar la conexión entre empresas y candidatos.</li>
              <li>Enviar notificaciones relacionadas con postulaciones y ofertas.</li>
              <li>Mejorar la funcionalidad y experiencia del Portal.</li>
              <li>Cumplir con obligaciones legales.</li>
            </ul>
          </Section>

          <Section title="4. Base legal del tratamiento">
            <p>
              El tratamiento de tus datos se basa en el consentimiento que otorgas al registrarte,
              en la ejecución del contrato de servicios y en el cumplimiento de obligaciones
              legales, de acuerdo con la LOPDP.
            </p>
          </Section>

          <Section title="5. Compartición de datos">
            <p>
              No vendemos ni cedemos tus datos personales a terceros con fines comerciales. Los
              datos de candidatos son visibles para las empresas a las que se postulan, y
              viceversa, en la medida necesaria para el proceso de selección. Podemos compartir
              datos con proveedores de servicios tecnológicos que actúan bajo nuestras
              instrucciones y con las mismas garantías de privacidad.
            </p>
          </Section>

          <Section title="6. Conservación de datos">
            <p>
              Conservamos tus datos mientras mantengas tu cuenta activa o durante el tiempo
              necesario para cumplir con las finalidades descritas. Al eliminar tu cuenta, tus
              datos personales serán suprimidos en un plazo máximo de 30 días, salvo obligación
              legal de conservación.
            </p>
          </Section>

          <Section title="7. Tus derechos">
            <p>
              De acuerdo con la LOPDP, tienes derecho a acceder, rectificar, suprimir, limitar el
              tratamiento, portar y oponerte al tratamiento de tus datos personales. Para ejercer
              estos derechos, contáctanos en{" "}
              <a href="mailto:privacidad@portalempleo.ec" className="text-primary underline">
                privacidad@portalempleo.ec
              </a>
              .
            </p>
          </Section>

          <Section title="8. Seguridad">
            <p>
              Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos
              contra el acceso no autorizado, pérdida, divulgación o alteración. Las contraseñas
              se almacenan de forma cifrada y las comunicaciones utilizan cifrado TLS.
            </p>
          </Section>

          <Section title="9. Cambios en esta política">
            <p>
              Podemos actualizar esta Política de Privacidad en cualquier momento. Te notificaremos
              por correo electrónico o mediante un aviso en el Portal cuando se produzcan cambios
              significativos.
            </p>
          </Section>
        </div>
      </div>
      <Footer />
    </MainLayout>
  );
}
