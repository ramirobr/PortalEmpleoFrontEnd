import { getPublicBlogs } from "@/lib/blog/fetch";
import { BlogResumen } from "@/types/blog";
import MainLayout from "@/components/shared/layout/MainLayout";
import Footer from "@/components/shared/components/Footer";
import Banner from "@/components/shared/components/Banner";
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
    <article className="group bg-white rounded-xl shadow-soft overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl h-full border border-zinc-100/20">
      {blog.imagenUrl ? (
        <div className="relative h-52 w-full shrink-0 overflow-hidden">
          <Image
            src={blog.imagenUrl}
            alt={blog.titulo}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-750 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      ) : (
        <div className="h-52 w-full bg-linear-to-br from-primary/5 to-primary/10 flex items-center justify-center shrink-0">
          <BookOpen className="size-12 text-primary/30" />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1 text-left">
        <h2 className="font-display text-xl font-bold text-slate-900 mb-3 leading-snug tracking-tight group-hover:text-primary transition-colors duration-300">
          {blog.titulo}
        </h2>
        <p className="font-body text-slate-500 text-sm leading-relaxed flex-1 mb-6">
          {blog.resumen}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-50">
          {blog.fechaPublicacion && (
            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-body" suppressHydrationWarning>
              <Calendar className="size-3.5" />
              {formatDate(blog.fechaPublicacion)}
            </span>
          )}
          <Link
            href={`/blog/${blog.slug}`}
            className="inline-flex items-center gap-1 text-xs font-display font-bold uppercase tracking-widest text-primary hover:text-primary-deep transition-all duration-300 group-hover:gap-2"
          >
            Leer más <span className="text-sm leading-none">→</span>
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
      <div className="min-h-screen bg-background font-body flex flex-col">
        <Banner title="Consejos para tu empresa" />

        <div className="container py-16 flex-1 flex flex-col justify-center">
          {blogs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-soft p-12 max-w-md mx-auto border border-zinc-100/10">
              <BookOpen className="size-16 mx-auto mb-6 opacity-35 text-primary animate-pulse" />
              <h3 className="font-display text-xl font-bold text-slate-900 mb-2">Próximamente</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Próximamente encontrarás aquí guías y recursos estratégicos para potenciar tu marca empleadora y optimizar tu selección.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
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
