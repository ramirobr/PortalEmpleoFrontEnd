import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";

export interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "white";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
}

export const PremiumButton = React.forwardRef<
  HTMLButtonElement,
  PremiumButtonProps
>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      isLoading,
      href,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const variantStyles = {
      primary:
        "bg-linear-to-r from-primary-container to-primary text-white hover:shadow-primary/30",
      secondary:
        "bg-linear-to-r from-secondary-container to-secondary text-white hover:shadow-secondary/30",
      outline: "border-2 border-primary text-primary hover:bg-primary/5",
      white: "bg-white text-primary hover:bg-zinc-50 shadow-sm",
    };

    const sizeStyles = {
      sm: "px-3 py-[10px] text-xs",
      md: "px-6 py-[10px] text-xs",
      lg: "px-8 py-[10px] text-sm",
    };

    const innerContent = (
      <>
        {/* Exact DOM structure for the shine effect requested by the user */}
        {(variant === "primary" || variant === "secondary") && (
          <div className="absolute inset-x-0 top-0 h-full w-full bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 skew-x-12" />
        )}

        {isLoading ? (
          <span className="animate-spin rounded-full size-4 border-2 border-current border-t-transparent relative z-10" />
        ) : (
          <span className="relative z-10 flex items-center justify-center gap-3 w-full">
            {icon && iconPosition === "left" && (
              <span className="size-4 shrink-0 flex items-center justify-center">
                {icon}
              </span>
            )}
            <span className="font-bold">{children}</span>
            {icon && iconPosition === "right" && (
              <span className="size-4 shrink-0 flex items-center justify-center">
                {icon}
              </span>
            )}
          </span>
        )}
      </>
    );

    const buttonClasses = cn(
      "relative group/btn flex items-center justify-center gap-3 rounded-full transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-1 hover:shadow-2xl uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed",
      variantStyles[variant],
      sizeStyles[size],
      className,
    );

    if (href) {
      return (
        <Link href={href} className={buttonClasses}>
          {innerContent}
        </Link>
      );
    }

    return (
      <button ref={ref} type={type} className={buttonClasses} {...props}>
        {innerContent}
      </button>
    );
  },
);

PremiumButton.displayName = "PremiumButton";
