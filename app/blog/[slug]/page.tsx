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
      <div className="min-h-screen bg-zinc-50">
        {blog.imagenUrl ? (
          <div className="relative h-72 md:h-96 w-full">
            <Image
              src={blog.imagenUrl}
              alt={blog.titulo}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-zinc-950/40" />
            <div className="absolute inset-0 flex items-end">
              <div className="container pb-10">
                <h1 className="text-3xl md:text-4xl font-semibold text-white leading-tight max-w-3xl">
                  {blog.titulo}
                </h1>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-primary to-primary-deep py-16">
            <div className="container">
              <h1 className="text-3xl md:text-4xl font-semibold text-white leading-tight max-w-3xl">
                {blog.titulo}
              </h1>
            </div>
          </div>
        )}

        <div className="container py-10">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft className="size-4" />
              Volver al blog
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8">
              {blog.fechaPublicacion && (
                <p className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6">
                  <Calendar className="size-3.5" />
                  {formatDate(blog.fechaPublicacion)}
                </p>
              )}

              <p className="text-zinc-600 text-base font-medium leading-relaxed mb-8 border-l-4 border-primary pl-4">
                {blog.resumen}
              </p>

              <div className="prose prose-gray max-w-none text-zinc-700 leading-relaxed whitespace-pre-line">
                {blog.contenido}
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-deep transition-colors"
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
