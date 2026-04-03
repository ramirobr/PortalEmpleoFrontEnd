import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, TrendingUp, Sparkles, Users, Zap } from "lucide-react";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  const categories = [
    {
      title: "Buscar Talento",
      description: "Contrata Personal",
      image: "/categories/buscar_talento.png",
      href: "/auth/login",
    },
    {
      title: "Empleador Independiente",
      description: "Busca Personal",
      image: "/categories/empleador_independiente.png",
      href: "/auth/login",
    },
    {
      title: "Buscar Empleo",
      description: "Trabajo Fijo o Temporal",
      image: "/categories/buscar_empleo.png",
      href: "/empleos-busqueda",
    },
    {
      title: "Ofrecer Servicios",
      description: "Ofrece tu trabajo",
      image: "/categories/ofrecer_servicios.png",
      href: "/empleos-busqueda/email?role=pasante",
    },
    {
      title: "Servicios Profesionales",
      description: "Consigue clientes",
      image: "/categories/servicios_profesionales.png",
      href: "/empleos-busqueda/email?role=horas",
    },
  ];

  return (
    <>
      {/* Header / Logo Section */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-md transition-all duration-300">
        <nav className="w-full max-w-7xl px-6 py-4 flex justify-between items-center m-auto">
          <div className="w-40 sm:w-48">
            <Image
              src="/logos/logo-empresa.jpg"
              alt="Implica Logo"
              width={200}
              height={66}
              className="object-contain"
              priority
            />
          </div>
          {!session && (
            <Link
              href="/auth/login"
              className="relative group/btn flex items-center justify-center gap-2.5 px-12 py-2.5 bg-linear-to-r from-secondary-container to-secondary text-white font-black text-[11px] uppercase tracking-widest rounded-full hover:shadow-2xl hover:shadow-secondary/30 transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-1"
            >
              <div className="absolute inset-x-0 top-0 h-full w-full bg-white/10 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 skew-x-12" />
              <span className="relative z-10">Iniciar Sesión</span>
            </Link>
          )}
        </nav>
      </header>
      <main className="min-h-screen bg-background flex flex-col items-center font-body">
        {/* Hero Section */}
        <section className="w-full max-w-7xl px-4 py-12 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 mb-6 tracking-tight">
            ¿Qué estás buscando?
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-16 leading-relaxed">
            Selecciona el perfil que mejor te describa para personalizar tu
            experiencia.
          </p>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full px-4 mb-24">
            {categories.map((cat, index) => (
              <ProfileCard
                key={index}
                title={cat.title}
                description={cat.description}
                image={cat.image}
                href={cat.href}
              />
            ))}
          </div>
        </section>

        {/* Secondary Hero Section */}
        <section className="w-full bg-white py-8 sm:py-12 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="flex flex-col items-start text-left max-w-xl">
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider mb-6 border border-primary/10">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  El Catalizador Editorial
                </div>

                <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-slate-900 leading-[1.1] mb-6">
                  Conectamos el{" "}
                  <span className="text-primary italic">talento</span> con la
                  oportunidad.
                </h2>

                <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                  Transforma tu carrera o equipo editorial hoy mismo mediante
                  nuestra red de curaduría digital avanzada.
                </p>

                <Link
                  href="/empleos-busqueda"
                  className="relative group/btn flex items-center justify-center gap-2.5 px-14 py-3 bg-linear-to-r from-secondary-container to-secondary text-white font-black text-xs uppercase tracking-widest rounded-full hover:shadow-2xl hover:shadow-secondary/40 transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-1"
                >
                  <div className="absolute inset-x-0 top-0 h-full w-full bg-white/10 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 skew-x-12" />
                  <span className="relative z-10">ENCUENTRA TU EQUIPO IDEAL</span>
                </Link>
              </div>

              {/* Right Visual */}
              <div className="relative">
                {/* Vessel Card Decoration */}
                <div className="absolute -inset-4 bg-slate-100 rounded-xl -rotate-2 scale-[1.02] opacity-50" />

                <div className="relative bg-white p-4 rounded-xl shadow-2xl border border-slate-100 transform rotate-1 hover:rotate-0 transition-transform duration-700">
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden shadow-inner">
                    <Image
                      src="/categories/meeting.png"
                      alt="Catalizador Editorial Meeting"
                      fill
                      className="object-cover transition-transform duration-1000 hover:scale-105"
                    />
                  </div>

                  {/* Statistics Overlay */}
                  <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-3 border border-slate-50 animate-bounce-subtle">
                    <div className="w-10 h-10 bg-primary-light/10 rounded-xl flex items-center justify-center text-primary-light">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-0.5">
                        Crecimiento
                      </p>
                      <p className="text-xl font-black text-slate-900 leading-none">
                        +240%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-background py-16 sm:py-20 px-6">
          <div className="max-w-7xl mx-auto bg-gray-200 rounded-xl p-6 lg:p-14 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            {/* Left: Info */}
            <div className="flex-1 text-left">
              <h2 className="text-3xl lg:text-4xl font-display font-extrabold text-slate-900 mb-8 tracking-tight">
                ¿Por qué elegir implica?
              </h2>
              <div className="space-y-6">
                <BenefitItem
                  icon={<Sparkles className="w-5 h-5" />}
                  title="Curaduría Digital"
                  description="Seleccionamos los perfiles más aptos mediante algoritmos avanzados de coincidencia editorial."
                />
                <BenefitItem
                  icon={<Users className="w-5 h-5" />}
                  title="Red Colaborativa"
                  description="Únete a la comunidad de profesionales editoriales más grande de la región."
                />
                <BenefitItem
                  icon={<Zap className="w-5 h-5" />}
                  title="Proceso Ágil"
                  description="De la postulación a la contratación en tiempo récord sin perder la calidad."
                />
              </div>
            </div>

            {/* Right: Visual */}
            <div className="flex-1 w-full relative">
              <div className="relative bg-white p-4 rounded-xl shadow-2xl border border-slate-100 transform -rotate-1 hover:rotate-0 transition-transform duration-700">
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-inner">
                  <Image
                    src="/categories/why_choose_us.png"
                    alt="Futuristic Collaboration"
                    fill
                    className="object-cover transition-transform duration-1000 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer / Bottom Spacing */}
      <footer className="w-full py-12 text-center text-sm border-t border-slate-100 bg-primary text-white">
        <p>
          &copy; {new Date().getFullYear()} Implica. Todos los derechos
          reservados.
        </p>
      </footer>
    </>
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
      <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white duration-300">
        {icon}
      </div>
      <div>
        <h4 className="text-xl font-bold text-slate-900 mb-2 transition-colors group-hover:text-primary">
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
      className="group relative flex flex-col items-center bg-white rounded-xl p-6 shadow-sm border border-slate-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-8"
    >
      {/* Circle Container for Image */}
      <div className="relative w-32 h-32 mb-6 overflow-hidden rounded-full border-4 border-white shadow-md transition-transform duration-500 group-hover:scale-110">
        <Image src={image} alt={title} fill className="object-cover" />
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Info */}
      <div className="flex flex-col items-center space-y-2">
        <h3 className="text-lg font-bold text-slate-900 text-center leading-tight transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="text-sm font-medium text-slate-600 text-center">
          {description}
        </p>
      </div>

      {/* Modern Interaction Indicator */}
      <div className="mt-8 w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className="w-0 h-full bg-primary transition-all duration-700 group-hover:w-full" />
      </div>
    </Link>
  );
}
