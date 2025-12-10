import React from "react";

interface TituloSubrayadoProps {
  children: React.ReactNode;
  className?: string;
}

const TituloSubrayado: React.FC<TituloSubrayadoProps> = ({
  children,
  className = "",
}) => (
  <h2
    className={`text-2xl font-bold mb-10 text-primary underline underline-offset-4 decoration-2 ${className}`}
  >
    {children}
  </h2>
);

export default TituloSubrayado;
