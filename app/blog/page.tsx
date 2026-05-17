import { getPublicBlogs } from "@/lib/blog/fetch";
import { BlogResumen } from "@/types/blog";
import MainLayout from "@/components/shared/layout/MainLayout";
import Footer from "@/components/shared/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Calendar } from "lucide-react";

export const metadata = {
  title: "Blog - Consejos para empresas | Portal Empleo",
  description:
    "Artículos y consejos para mejorar tus procesos de contratación y atraer al mejor talento.",
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function BlogCard({ blog }: { blog: BlogResumen }) {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden flex flex-col transition-shadow hover:shadow-md">
      {blog.imagenUrl ? (
        <div className="relative h-52 w-full shrink-0">
          <Image
            src={blog.imagenUrl}
            alt={blog.titulo}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <div className="h-52 w-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center shrink-0">
          <BookOpen className="size-14 text-primary/40" />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <h2 className="text-xl font-semibold text-zinc-900 mb-3 leading-snug">
          {blog.titulo}
        </h2>
        <p className="text-zinc-600 text-sm leading-relaxed flex-1 mb-4">
          {blog.resumen}
        </p>
        <div className="flex items-center justify-between mt-auto">
          {blog.fechaPublicacion && (
            <span className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Calendar className="size-3.5" />
              {formatDate(blog.fechaPublicacion)}
            </span>
          )}
          <Link
            href={`/blog/${blog.slug}`}
            className="ml-auto text-sm font-semibold text-primary hover:text-primary-deep transition-colors"
          >
            Leer más →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function BlogPage() {
  const blogs = (await getPublicBlogs()) ?? [];

  return (
    <MainLayout>
      <div className="min-h-screen bg-zinc-50">
        <div className="bg-gradient-to-br from-primary to-primary-deep py-16 text-white">
          <div className="container text-center">
            <h1 className="text-4xl font-semibold mb-4">
              Consejos para tu empresa
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Recursos y guías para optimizar tus procesos de reclutamiento y
              atraer al mejor talento.
            </p>
          </div>
        </div>

        <div className="container py-12">
          {blogs.length === 0 ? (
            <div className="text-center py-20 text-zinc-400">
              <BookOpen className="size-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Próximamente encontrarás contenido aquí.</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <BlogCard key={blog.idBlog} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </MainLayout>
  );
}
