import Link from "next/link";
import React from "react";

const CallToAction = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="bg-black py-20 px-4 text-center rounded-3xl mx-auto  shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
            ¿Listo para dar el siguiente paso?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">
            Únete a miles de profesionales que ya han encontrado su trabajo
            ideal a través de nuestra plataforma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/crear" className="btn btn-primary">
              Crear mi perfil
            </Link>
            <Link href="/auth/empresa" className="btn btn-white">
              Para Empresas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
