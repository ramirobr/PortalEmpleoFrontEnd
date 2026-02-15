import { cn } from "@/lib/utils";
import { Children } from "@/types/generic";
import React, { HTMLAttributes } from "react";

const TituloSubrayado: React.FC<
  Children & Partial<HTMLAttributes<HTMLHeadingElement>>
> = ({ children, className = "" }) => (
  <h2
    className={cn(
      "text-xl font-bold text-primary flex items-center gap-2 mb-3.5 md:text-2xl",
      className,
    )}
  >
    {children}
  </h2>
);

export default TituloSubrayado;
