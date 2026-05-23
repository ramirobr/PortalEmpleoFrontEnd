import { getBlogBySlug } from "@/lib/blog/fetch";
import MainLayout from "@/components/shared/layout/MainLayout";
import Footer from "@/components/shared/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Calendar } from "lucide-react";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Artículo no encontrado" };
  return {
    title: `${blog.titulo} | Blog Portal Empleo`,
    description: blog.resumen,
  };
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  return (
    <MainLayout>
      <div className="min-h-screen bg-background font-body">
        {blog.imagenUrl ? (
          <div className="relative h-80 md:h-110 w-full overflow-hidden flex items-end">
            <Image
              src={blog.imagenUrl}
              alt={blog.titulo}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-1000 scale-102"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/40 to-transparent z-0" />
            <div className="container relative z-10 pb-12 text-left">
              <h1 className="font-display text-3xl md:text-5xl font-extrabold text-white leading-tight max-w-4xl drop-shadow-md">
                {blog.titulo}
              </h1>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-primary to-primary-deep py-20">
            <div className="container text-left">
              <h1 className="font-display text-3xl md:text-5xl font-extrabold text-white leading-tight max-w-4xl">
                {blog.titulo}
              </h1>
            </div>
          </div>
        )}

        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-widest text-slate-500 hover:text-primary mb-8 transition-colors duration-300 group"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Volver al blog
            </Link>

            <div className="bg-white rounded-xl shadow-soft p-8 md:p-12 border border-zinc-100/10">
              {blog.fechaPublicacion && (
                <div className="flex items-center gap-2 text-xs text-slate-400 font-body mb-8 pb-4 border-b border-zinc-50" suppressHydrationWarning>
                  <Calendar className="size-4 text-primary/70" />
                  <span>{formatDate(blog.fechaPublicacion)}</span>
                </div>
              )}

              <p className="font-body text-slate-600 text-lg font-medium leading-relaxed mb-10 border-l-4 border-primary pl-6 py-1 italic">
                {blog.resumen}
              </p>

              <div className="prose prose-zinc max-w-none text-slate-700 leading-relaxed text-base whitespace-pre-line font-body font-normal space-y-4">
                {blog.contenido}
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-widest text-primary hover:text-primary-deep transition-all duration-300 hover:gap-3"
              >
                <BookOpen className="size-4" />
                Ver más artículos
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </MainLayout>
  );
}
