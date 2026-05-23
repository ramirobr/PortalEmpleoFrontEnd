import Image from "next/image";
import Link from "next/link";
import { Sparkles, Users, Zap } from "lucide-react";
import { auth } from "@/auth";
import { fetchTestimonials } from "@/lib/testimonials/fetch";
import Testimonials from "@/components/shared/components/Testimonials";
import MainLayout from "@/components/shared/layout/MainLayout";
import Footer from "@/components/shared/components/Footer";

export default async function Home() {
  const [session, testimonialsData] = await Promise.all([
    auth(),
    fetchTestimonials(),
  ]);
  const testimonials = testimonialsData ?? [];

  const categories = [
    {
      title: "Buscar talento para mi empresa",
      description: "Contrata Personal",
      image: "/categories/buscar_talento.png",
      href: "/auth/empresa",
    },
    {
      title: "Empleador independiente",
      description: "Busca Personal",
      image: "/categories/empleador_independiente.png",
      href: "/auth/empresa",
    },
    {
      title: "Buscar empleo",
      description: "Trabajo fijo tiempo completo o parcial",
      image: "/categories/buscar_empleo.png",
      href: "/empleos-busqueda",
    },
    {
      title: "Servicios profesionales",
      description: "Ofrece tu trabajo y consigue clientes",
      image: "/categories/ofrecer_servicios.png",
      href: "/auth/email",
    },
    {
      title: "Pasantías",
      description: "Estudiantes en busca de experiencia",
      image: "/categories/servicios_profesionales.png",
      href: "/auth/email",
    },
  ];

  return (
    <MainLayout>
      <main className="min-h-screen bg-background flex flex-col items-center font-body">
        {/* Hero Section */}
        <section className="w-full container px-4 py-12 flex flex-col items-center text-center">
          {/* Tagline */}
          <p className="text-2xl lg:text-3xl lg:text-4xl font-display font-extrabold text-primary mb-3 leading-tight">
            Conectando empresas, empleadores y personas en busca de trabajo
          </p>
          <p className="text-base lg:text-lg text-slate-600 max-w-2xl mb-10 leading-relaxed">
            Encuentra el talento ideal para tu negocio o la oportunidad laboral
            que estás buscando
          </p>

          <h1 className="text-4xl lg:text-5xl lg:text-6xl font-display font-semibold text-slate-900 mb-6 tracking-tight">
            ¿Qué estás buscando?
          </h1>
          <p className="text-lg lg:text-xl text-slate-500 max-w-2xl mb-16 leading-relaxed">
            Selecciona el perfil que mejor te describa para personalizar tu
            experiencia.
          </p>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-5 gap-6 w-full px-4 mb-12">
            {categories.map((cat) => (
              <ProfileCard
                key={cat.title}
                title={cat.title}
                description={cat.description}
                image={cat.image}
                href={cat.href}
              />
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href="/buscar-candidatos"
            className="relative group/btn flex items-center justify-center gap-2.5 px-14 py-3 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-1 mb-16"
          >
            <div className="absolute inset-x-0 top-0 h-full w-full bg-white/10 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 skew-x-12" />
            <span className="relative z-10">ENCUENTRA TU EQUIPO IDEAL</span>
          </Link>
        </section>

        <section className="container">
          <div className="bg-zinc-200 rounded-xl p-6 lg:p-14 shadow-sm border border-zinc-100 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            {/* Left: Info */}
            <div className="flex-1 text-left">
              <h2 className="text-3xl lg:text-4xl font-display font-semibold text-slate-900 mb-8 tracking-tight">
                ¿Por qué elegir implica?
              </h2>
              <div className="space-y-6">
                <BenefitItem
                  icon={<Sparkles className="size-5" />}
                  title="Curaduría Digital"
                  description="Seleccionamos los perfiles más aptos mediante algoritmos avanzados de coincidencia editorial."
                />
                <BenefitItem
                  icon={<Users className="size-5" />}
                  title="Red Colaborativa"
                  description="Únete a la comunidad de profesionales editoriales más grande de la región."
                />
                <BenefitItem
                  icon={<Zap className="size-5" />}
                  title="Proceso Ágil"
                  description="De la postulación a la contratación en tiempo récord sin perder la calidad."
                />
              </div>
            </div>

            {/* Right: Visual */}
            <div className="flex-1 w-full relative">
              <div className="relative bg-white p-4 rounded-xl shadow-2xl border border-zinc-100 transform -rotate-1 hover:rotate-0 transition-transform duration-700">
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-inner">
                  <Image
                    src="/categories/why_choose_us.png"
                    alt="Futuristic Collaboration"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-1000 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Testimonials testimonials={testimonials} />
      </main>
      <Footer />
    </MainLayout>
  );
}

function BenefitItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-6 group">
      <div className="shrink-0 size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white duration-300">
        {icon}
      </div>
      <div>
        <h4 className="text-xl font-semibold text-slate-900 mb-2 transition-colors group-hover:text-primary">
          {title}
        </h4>
        <p className="text-slate-500 leading-relaxed max-w-sm">{description}</p>
      </div>
    </div>
  );
}

function ProfileCard({
  title,
  description,
  image,
  href,
}: {
  title: string;
  description: string;
  image: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col items-center bg-white rounded-xl p-6 shadow-sm border border-zinc-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-8"
    >
      {/* Circle Container for Image */}
      <div className="relative size-32 mb-6 overflow-hidden rounded-full border-4 border-white shadow-md transition-transform duration-500 group-hover:scale-110">
        <Image src={image} alt={title} fill sizes="128px" className="object-cover" />
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Info */}
      <div className="flex flex-col items-center space-y-2">
        <h3 className="text-lg font-semibold text-slate-900 text-center leading-tight transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="text-sm font-medium text-slate-600 text-center">
          {description}
        </p>
      </div>

      {/* Modern Interaction Indicator */}
      <div className="mt-8 w-12 h-1 bg-zinc-100 rounded-full overflow-hidden">
        <div className="w-0 h-full bg-primary transition-all duration-700 group-hover:w-full" />
      </div>
    </Link>
  );
}
