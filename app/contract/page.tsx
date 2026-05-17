import MainLayout from "@/components/shared/layout/MainLayout";
import Footer from "@/components/shared/components/Footer";

export const metadata = {
  title: "Condiciones de Contratación | Portal Empleo",
  description:
    "Condiciones aplicables a la contratación de planes y servicios en Portal Empleo.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-zinc-900 mb-3">{title}</h2>
      <div className="text-zinc-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function ContractPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-zinc-50">
        <div className="bg-gradient-to-br from-primary to-primary-deep py-14 text-white">
          <div className="container text-center">
            <h1 className="text-4xl font-semibold mb-3">Condiciones de Contratación</h1>
            <p className="text-white/80 text-base max-w-xl mx-auto">
              Condiciones específicas aplicables a los planes y servicios contratados en el Portal.
            </p>
          </div>
        </div>

        <div className="container py-12 max-w-3xl">
          <p className="text-sm text-zinc-400 mb-8">Última actualización: enero 2025</p>

          <Section title="1. Objeto del contrato">
            <p>
              Las presentes Condiciones de Contratación regulan la relación entre Portal Empleo y
              las empresas que contraten los servicios de publicación de ofertas laborales y acceso
              al banco de talentos disponibles en la plataforma.
            </p>
          </Section>

          <Section title="2. Proceso de registro de empresa">
            <p>
              Para contratar los servicios, la empresa deberá registrarse proporcionando información
              veraz y actualizada, incluyendo razón social, RUC, datos de contacto y representante
              legal. Portal Empleo se reserva el derecho de verificar dicha información y rechazar
              registros que no cumplan los requisitos.
            </p>
          </Section>

          <Section title="3. Publicación de ofertas laborales">
            <p>
              Las empresas registradas podrán publicar ofertas de empleo sujetas a las siguientes
              condiciones:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Las ofertas deben ser reales, vigentes y corresponder a una necesidad laboral efectiva.</li>
              <li>No se permitirá contenido discriminatorio por razón de género, edad, etnia, discapacidad, religión u orientación sexual.</li>
              <li>Los requisitos exigidos deben ser proporcionales al puesto ofertado.</li>
              <li>Se debe indicar el tipo de contrato, jornada y, preferentemente, el rango salarial.</li>
              <li>Portal Empleo podrá retirar publicaciones que infrinjan estas condiciones sin previo aviso.</li>
            </ul>
          </Section>

          <Section title="4. Obligaciones de la empresa">
            <p>La empresa contratante se compromete a:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Tratar los datos de los candidatos conforme a la Ley Orgánica de Protección de Datos Personales.</li>
              <li>Utilizar la información de los candidatos exclusivamente para los procesos de selección.</li>
              <li>No ceder, vender ni compartir datos de candidatos a terceros.</li>
              <li>Informar a los candidatos sobre el resultado de su postulación en un plazo razonable.</li>
              <li>Cumplir con la legislación laboral ecuatoriana en todos los procesos de contratación.</li>
            </ul>
          </Section>

          <Section title="5. Vigencia y cancelación">
            <p>
              Las cuentas de empresa permanecerán activas indefinidamente mientras se mantenga
              el cumplimiento de estas condiciones. La empresa puede solicitar la cancelación de
              su cuenta en cualquier momento. Portal Empleo podrá suspender o eliminar cuentas
              que incumplan estas condiciones, previa notificación salvo en casos de infracción grave.
            </p>
          </Section>

          <Section title="6. Responsabilidad">
            <p>
              Portal Empleo no garantiza la idoneidad de los candidatos para los puestos
              publicados ni el éxito del proceso de selección. La empresa es la única responsable
              de las decisiones de contratación que adopte. Portal Empleo tampoco asume
              responsabilidad por los datos facilitados por las empresas que resulten inexactos
              o desactualizados.
            </p>
          </Section>

          <Section title="7. Modificación de condiciones">
            <p>
              Portal Empleo podrá modificar estas Condiciones de Contratación comunicándolo
              con un mínimo de 15 días de antelación. La continuación en el uso del servicio
              tras dicho plazo implicará la aceptación de las nuevas condiciones.
            </p>
          </Section>

          <Section title="8. Legislación aplicable y jurisdicción">
            <p>
              Las presentes Condiciones se rigen por la legislación ecuatoriana. Las partes se
              someten expresamente a la jurisdicción de los tribunales de la ciudad de Quito para
              la resolución de cualquier controversia derivada de la interpretación o aplicación
              de estas condiciones.
            </p>
          </Section>

          <p className="text-sm text-zinc-400 mt-10">
            Para consultas sobre estas condiciones escríbenos a{" "}
            <a href="mailto:legal@portalempleo.ec" className="text-primary underline">
              legal@portalempleo.ec
            </a>
            .
          </p>
        </div>
      </div>
      <Footer />
    </MainLayout>
  );
}
