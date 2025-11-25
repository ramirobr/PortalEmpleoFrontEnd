import React from "react";
import Image from "next/image";
import Link from "next/link";

const Jumbo = () => {
  return (
    <section className="relative w-full min-h-[400px] flex flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 w-full h-full z-0">
        <Image src="/jumbo.jpg" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative z-10 w-full max-w-2xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight text-shadow-md">
          Busca, tenemos más de <span className="text-primary ">50,000</span>{" "}
          opciones.
        </h2>
        <Link
          href="/empleos-busqueda"
          className="btn btn-primary my-5 inline-block shadow-2xl text-2xl uppercase"
        >
          Ver Ofertas de Trabajo
        </Link>
      </div>
    </section>
  );
};

export default Jumbo;
