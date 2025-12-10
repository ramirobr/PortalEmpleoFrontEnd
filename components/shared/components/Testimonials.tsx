"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Testimonial } from "@/types/testimonials";
import Image from "next/image";

export type TestimonialsProps = {
  testimonials: Testimonial[] | undefined;
};

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="bg-gray-100 py-20">
      <div className="container">
        <h2 className="section-title">Testimonios</h2>
        <div className="relative">
          <Swiper
            modules={[Pagination, Navigation]}
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
            navigation={true}
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
          <style>{`
            .testimonials-swiper .swiper-button-prev,
            .testimonials-swiper .swiper-button-next {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              z-index: 10;
              width: 44px;
              height: 44px;
              background: #fff;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.08);
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .testimonials-swiper .swiper-button-prev {
              left: -56px;
            }
            .testimonials-swiper .swiper-button-next {
              right: -56px;
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
