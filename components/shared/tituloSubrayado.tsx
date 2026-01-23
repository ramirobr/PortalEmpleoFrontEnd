import { cn } from "@/lib/utils";
import { Children } from "@/types/generic";
import React, { HTMLAttributes } from "react";

const TituloSubrayado: React.FC<
  Children & Partial<HTMLAttributes<HTMLHeadingElement>>
> = ({ children, className = "" }) => (
  <h2
    className={cn(
      "text-2xl font-bold mb-10 text-primary decoration-2 text-black",
      className,
    )}
  >
    {children}
  </h2>
);

export default TituloSubrayado;
