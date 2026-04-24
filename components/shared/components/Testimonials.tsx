"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Testimonial } from "@/types/testimonials";
import "@/app/styles/layout/swiper.css";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export type TestimonialsProps = {
  testimonials: Testimonial[] | undefined;
};

export default function Testimonials({ testimonials }: TestimonialsProps) {
  if (!testimonials?.length) return null;

  return (
    <section className="w-full py-16 sm:py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 text-center mb-12 tracking-tight">
          Lo que dicen de nosotros
        </h2>

        <div className="relative">
          {/* Nav buttons */}
          <button className="testimonials-prev absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-200 disabled:opacity-30">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="testimonials-next absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-200 disabled:opacity-30">
            <ChevronRight className="w-5 h-5" />
          </button>

          <Swiper
            modules={[Pagination, Navigation]}
            navigation={{
              prevEl: ".testimonials-prev",
              nextEl: ".testimonials-next",
            }}
            pagination={{ clickable: true }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="testimonials-swiper !pb-12"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.idTestimonio} className="h-auto">
                <div className="flex flex-col bg-white rounded-xl p-6 shadow-sm border border-slate-100 gap-4 h-full">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm bg-slate-100">
                      {t.foto ? (
                        <Image
                          src={`data:image/jpeg;base64,${t.foto.trim()}`}
                          alt={t.nombreCompleto}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xl font-bold">
                          {t.nombreCompleto.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-primary">{t.nombreCompleto}</p>
                      {(t.cargo || t.empresa) && (
                        <p className="text-xs text-slate-500">
                          {[t.cargo, t.empresa].filter(Boolean).join(" en ")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < t.calificacion ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                      />
                    ))}
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed flex-1">
                    &ldquo;{t.testimonioDetalle}&rdquo;
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
