"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Testimonial } from "@/types/testimonials";
import "@/app/styles/layout/swiper.css"; // Custom styles for Swiper
import Image from "next/image";

export type TestimonialsProps = {
  testimonials: Testimonial[] | undefined;
};

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container">
        <h2 className="text-2xl font-black tracking-[0.2em] text-primary uppercase text-center mb-15">
          Testimonios
        </h2>
        <div className="relative">
          {testimonials?.length ? (
            <Swiper
              modules={[Pagination]}
              pagination={{
                clickable: true,
                renderBullet: (_, className) => {
                  const safeClass =
                    className && className.trim()
                      ? className
                      : "swiper-pagination-bullet";
                  return `<span class='${safeClass}'></span>`;
                },
              }}
              spaceBetween={32}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-10 testimonials-swiper"
            >
              {testimonials?.map((t, idx) => (
                <SwiperSlide key={idx}>
                  <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center border border-gray-light max-w-md mx-auto min-h-[350px] h-full focus:outline-none focus:ring-2 focus:ring-secondary">
                    <Image
                      // src={t.foto} FIXME: Foto path doesnt work
                      src="/logos/company_logo.png"
                      alt={t.nombreCompleto}
                      className="w-20 h-20 rounded-full mb-4 border-4 border-secondary object-cover"
                      width={80}
                      height={80}
                      loading="lazy"
                    />
                    <blockquote className="text-gray-dark text-center italic mb-4">
                      “{t.testimonioDetalle}”
                    </blockquote>
                    <div className="text-center">
                      <span className="block font-semibold text-primary">
                        {t.nombreCompleto}
                      </span>
                      <span className="block text-sm text-secondary">
                        {t.cargo}
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-center">
              No hay testimonios disponibles en este momento.
            </p>
          )}
          <style>{`
            .testimonials-swiper {
              overflow: hidden !important;
            }
            .testimonials-swiper .swiper-wrapper {
              align-items: stretch;
            }
            .testimonials-swiper .swiper-slide {
              display: flex !important;
              align-items: stretch;
              height: auto;
            }
            .testimonials-swiper .swiper-slide > div {
              width: 100%;
            }
            .testimonials-swiper .swiper-pagination {
              position: static;
              margin-top: 3rem;
              display: flex;
              justify-content: center;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
