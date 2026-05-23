import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  icon: React.ReactNode;
  variant?: "primary" | "danger" | "warning" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const ActionButton = React.forwardRef<
  HTMLButtonElement,
  ActionButtonProps
>(
  (
    {
      className,
      icon,
      variant = "primary",
      size = "md",
      isLoading,
      href,
      type = "button",
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    const variantStyles = {
      primary: cn(
        "text-primary border border-sky-100/50 bg-sky-50/80 shadow-md",
        !isDisabled && "hover:bg-primary/10 hover:shadow-lg"
      ),
      danger: cn(
        "text-red-600 border border-red-100/50 bg-red-50/80 shadow-md",
        !isDisabled && "hover:bg-red-100 hover:shadow-lg"
      ),
      warning: cn(
        "text-amber-600 border border-amber-100/50 bg-amber-50/80 shadow-md",
        !isDisabled && "hover:bg-amber-100 hover:shadow-lg"
      ),
      success: cn(
        "text-emerald-700 border border-emerald-100/50 bg-emerald-50/80 shadow-md",
        !isDisabled && "hover:bg-emerald-100 hover:shadow-lg"
      ),
    };

    const sizeStyles = {
      sm: "size-7",
      md: "size-9",
      lg: "size-11",
    };

    const iconSizeStyles = {
      sm: "[&_svg]:size-[14px]",
      md: "[&_svg]:size-[18px]",
      lg: "[&_svg]:size-[22px]",
    };

    const innerContent = isLoading ? (
      <span className="animate-spin rounded-full size-4 border-2 border-current border-t-transparent" />
    ) : (
      <span className={cn(
        "flex items-center justify-center transition-transform duration-300", 
        !isDisabled && "group-hover:scale-110",
        iconSizeStyles[size]
      )}>
        {icon}
      </span>
    );

    const btnClasses = cn(
      "group inline-flex items-center justify-center rounded-full transition-all duration-300 outline-none select-none",
      isDisabled
        ? "opacity-80 grayscale cursor-not-allowed"
        : "cursor-pointer active:scale-95",
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    if (href) {
      return (
        <Link 
          href={href} 
          className={btnClasses} 
          title={props.title} 
          aria-label={props["aria-label"]}
          tabIndex={isDisabled ? -1 : undefined}
          aria-disabled={isDisabled}
          onClick={(e) => {
            if (isDisabled) {
              e.preventDefault();
            }
          }}
        >
          {innerContent}
        </Link>
      );
    }

    return (
      <button 
        ref={ref} 
        type={type} 
        className={btnClasses} 
        disabled={disabled}
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : undefined}
        {...props}
      >
        {innerContent}
      </button>
    );
  }
);

ActionButton.displayName = "ActionButton";
