import React from "react";
import Image from "next/image";
import Link from "next/link";

const Jumbo = () => {
  return (
    <section className="relative w-full min-h-[600px] h-[75vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 w-full h-full z-0">
        <Image src="/jumbo.jpg" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center">
        <h1 className="text-5xl text-shadow-lg font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Encuentra tu próximo <br />
          <span className="text-primary">desafío profesional</span>
        </h1>
        <p className="text-shadow-md mx-auto mt-6 max-w-2xl text-lg leading-8 text-white">
          Conectamos a los mejores talentos con las empresas más innovadoras del
          mercado. <br />
          Tu futuro comienza hoy.
        </p>
        <Link
          href="/empleos-busqueda"
          className="btn btn-primary my-5 inline-block shadow-2xl text-2xl uppercase px-8 py-4 font-bold rounded-xl"
        >
          Ver Ofertas de Trabajo
        </Link>
      </div>
    </section>
  );
};

export default Jumbo;
