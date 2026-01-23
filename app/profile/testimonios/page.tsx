"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TestimoniosList from "./components/TestimoniosList";
import TestimonioForm from "./components/TestimonioForm";
import { MessageSquareQuote } from "lucide-react";
import { fetchUserTestimonials } from "@/lib/testimonials/fetch";
import { UserTestimonial } from "@/lib/testimonials/schema";
import { useAuthStore } from "@/context/authStore";

export default function TestimoniosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = useAuthStore((s) => s.id);
  
  const [testimonios, setTestimonios] = useState<UserTestimonial[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);

  const loadTestimonios = useCallback(async (page = currentPage, size = pageSize) => {
    if (!session?.user.accessToken || !userId) return;
    
    setLoading(true);
    try {
      const response = await fetchUserTestimonials(
        {
          pageSize: size,
          currentPage: page,
          sortBy: "",
          sortDirection: "",
          idUsuario: userId,
        },
        session.user.accessToken
      );

      if (response?.isSuccess && response.data) {
        setTestimonios(response.data.data);
        setTotalItems(response.data.totalItems);
      } else {
        setTestimonios([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.warn("Error loading testimonials:", error);
      setTestimonios([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [session?.user.accessToken, userId, currentPage, pageSize]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && userId) {
      loadTestimonios();
    }
  }, [status, router, userId, loadTestimonios]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadTestimonios(page, pageSize);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    loadTestimonios(1, size);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    loadTestimonios(1, pageSize);
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <MessageSquareQuote className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary">Mis Testimonios</h1>
        </div>
        <p className="text-muted-foreground">Cargando testimonios...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <MessageSquareQuote className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-primary">Mis Testimonios</h1>
      </div>

      <p className="text-muted-foreground">
        Comparte tu experiencia usando PortalEmpleo. Tu testimonio puede ayudar
        a otros usuarios a conocer los beneficios de nuestra plataforma.
      </p>

      <TestimonioForm onSuccess={handleRefresh} />

      <TestimoniosList 
        testimonios={testimonios}
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={pageSize}
        loading={loading}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
