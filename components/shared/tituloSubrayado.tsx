import { cn } from "@/lib/utils";
import { Children } from "@/types/generic";
import React, { HTMLAttributes } from "react";

const TituloSubrayado: React.FC<
  Children & Partial<HTMLAttributes<HTMLHeadingElement>>
> = ({ children, className = "" }) => (
  <h2
    className={cn(
      "text-2xl font-bold mb-10 text-primary underline underline-offset-4 decoration-2",
      className
    )}
  >
    {children}
  </h2>
);

export default TituloSubrayado;
