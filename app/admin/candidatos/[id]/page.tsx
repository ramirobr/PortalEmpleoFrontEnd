import Link from "next/link";
import { auth } from "@/auth";
import { ArrowLeft, Briefcase, Calendar, GraduationCap, Languages, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminCandidatoById } from "@/lib/admin/adminCandidatos";
import { getCandidatePicById } from "@/lib/user/info";
import { formatDate, getInitials, normalizeImageSrc } from "@/lib/utils";
import { UserInfoData } from "@/types/user";

interface AdminCandidatoDetallePageProps {
  params: Promise<{ id: string }>;
}

function fullName(candidate: UserInfoData) {
  return [candidate.datosPersonales?.nombre, candidate.datosPersonales?.apellido]
    .filter(Boolean)
    .join(" ");
}

function location(candidate: UserInfoData) {
  return [
    candidate.datosContacto?.ciudad,
    candidate.datosContacto?.provincia,
    candidate.datosContacto?.pais,
  ]
    .filter(Boolean)
    .join(", ");
}

function Field({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-800">{value || "-"}</p>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-slate-900">
        <span className="text-primary">{icon}</span>
        {title}
      </h2>
      {children}
    </Card>
  );
}

export default async function AdminCandidatoDetallePage({
  params,
}: AdminCandidatoDetallePageProps) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const token = session?.user?.accessToken;

  if (!token) {
    return (
      <Card className="p-8">
        <h1 className="text-2xl font-semibold text-slate-900">No autorizado</h1>
        <p className="mt-2 text-slate-500">Debes iniciar sesión para ver este perfil.</p>
      </Card>
    );
  }

  const [candidateResponse, picture] = await Promise.all([
    getAdminCandidatoById(id, token),
    getCandidatePicById(id, token),
  ]);

  if (!candidateResponse?.isSuccess || !candidateResponse.data) {
    return (
      <Card className="p-8">
        <Button asChild variant="outline" className="mb-6">
          <Link href="/admin/candidatos">
            <ArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold text-slate-900">Candidato no encontrado</h1>
        <p className="mt-2 text-slate-500">
          No se pudo cargar el perfil solicitado desde administración.
        </p>
      </Card>
    );
  }

  const candidate = candidateResponse.data;
  const name = fullName(candidate) || "Candidato";
  const currentRole =
    candidate.experienciaLaboral?.find((item) => item.estaTrabajando)?.puesto ||
    candidate.experienciaLaboral?.[0]?.puesto ||
    "Postulante";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Button asChild variant="outline" className="mb-4">
            <Link href="/admin/candidatos">
              <ArrowLeft className="size-4" />
              Volver a candidatos
            </Link>
          </Button>
          <h1 className="text-3xl font-semibold text-slate-900">Perfil del candidato</h1>
          <p className="mt-1 text-slate-500">
            Consulta administrativa del postulante seleccionado.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="h-28 bg-primary/10" />
        <div className="flex flex-col gap-5 px-6 pb-6 sm:flex-row sm:items-end sm:px-8">
          <Avatar className="-mt-14 size-28 border-4 border-white bg-white shadow-md">
            <AvatarImage src={normalizeImageSrc(picture as string | undefined)} alt={name} />
            <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold text-slate-900">{name}</h2>
              <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                {candidate.estadoCuenta || "Sin estado"}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-primary">{currentRole}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Mail className="size-4" />
                {candidate.datosContacto?.email || "-"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Phone className="size-4" />
                {candidate.datosContacto?.celular || candidate.datosContacto?.telefono || "-"}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-4" />
                {location(candidate) || "Ubicación no disponible"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-4" />
                Registro: {formatDate(candidate.fechaRegistro)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Section title="Datos personales" icon={<UserRound className="size-5" />}>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Documento" value={candidate.datosPersonales?.numeroDocumento} />
              <Field label="Tipo documento" value={candidate.datosPersonales?.tipoDocumento} />
              <Field label="Fecha nacimiento" value={formatDate(candidate.datosPersonales?.fechaNacimiento)} />
              <Field label="Nacionalidad" value={candidate.datosPersonales?.nacionalidad} />
              <Field label="Género" value={candidate.datosPersonales?.genero} />
              <Field label="Estado civil" value={candidate.datosPersonales?.idEstadoCivil ? String(candidate.datosPersonales.idEstadoCivil) : "-"} />
              <Field label="Movilidad propia" value={candidate.datosPersonales?.movilidad ? "Sí" : "No"} />
              <Field label="Licencia" value={candidate.datosPersonales?.licencia ? "Sí" : "No"} />
              <Field label="Tipo licencia" value={candidate.datosPersonales?.tipoLicencia?.join(", ")} />
            </div>
          </Section>

          <Section title="Experiencia laboral" icon={<Briefcase className="size-5" />}>
            {candidate.experienciaLaboral?.length ? (
              <div className="space-y-4">
                {candidate.experienciaLaboral.map((experience) => (
                  <div key={experience.id} className="border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
                    <p className="font-semibold text-slate-900">{experience.puesto}</p>
                    <p className="text-sm text-slate-600">{experience.empresa}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(experience.fechaInicio)} - {experience.estaTrabajando ? "Actualidad" : formatDate(experience.fechaFin)}
                    </p>
                    {experience.descripcion ? (
                      <p className="mt-2 text-sm text-slate-600">{experience.descripcion}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Sin experiencia laboral registrada.</p>
            )}
          </Section>

          <Section title="Educación" icon={<GraduationCap className="size-5" />}>
            {candidate.educacion?.length ? (
              <div className="space-y-4">
                {candidate.educacion.map((education) => (
                  <div key={education.id} className="border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
                    <p className="font-semibold text-slate-900">{education.titulo}</p>
                    <p className="text-sm text-slate-600">{education.institucion}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(education.fechaInicio)} - {education.estaCursando ? "Actualidad" : formatDate(education.fechaFin)}
                    </p>
                    {education.descripcion ? (
                      <p className="mt-2 text-sm text-slate-600">{education.descripcion}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Sin educación registrada.</p>
            )}
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Contacto" icon={<Phone className="size-5" />}>
            <div className="space-y-4">
              <Field label="Correo" value={candidate.datosContacto?.email} />
              <Field label="Teléfono" value={candidate.datosContacto?.telefono} />
              <Field label="Celular" value={candidate.datosContacto?.celular} />
              <Field label="Dirección" value={candidate.datosContacto?.direccion} />
              <Field label="Referencia 1" value={candidate.datosPersonales?.telefonoReferencia1} />
              <Field label="Referencia 2" value={candidate.datosPersonales?.telefonoReferencia2} />
            </div>
          </Section>

          <Section title="Habilidades" icon={<Briefcase className="size-5" />}>
            {candidate.habiliades?.length ? (
              <div className="flex flex-wrap gap-2">
                {candidate.habiliades.map((skill) => (
                  <span key={skill.id} className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-slate-700">
                    {skill.nombre}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Sin habilidades registradas.</p>
            )}
          </Section>

          <Section title="Idiomas" icon={<Languages className="size-5" />}>
            {candidate.idiomas?.length ? (
              <div className="space-y-3">
                {candidate.idiomas.map((language) => (
                  <div key={language.id} className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-slate-800">{language.nombre}</span>
                    <span className="text-sm text-slate-500">{language.nivel}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Sin idiomas registrados.</p>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}
