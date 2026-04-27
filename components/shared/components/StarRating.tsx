"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number | string;
  className?: string;
  starClassName?: string;
  showEmpty?: boolean;
}

/**
 * Reusable StarRating component that follows the app's design system.
 * Filled stars use the brand's label-star color.
 */
export function StarRating({
  rating,
  maxRating = 5,
  size = 20,
  className,
  starClassName,
  showEmpty = true,
}: StarRatingProps) {
  const roundedRating = Math.round(rating);

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="img"
      aria-label={`Calificación: ${rating} de ${maxRating} estrellas`}
    >
      {Array.from({ length: maxRating }).map((_, i) => {
        const isFilled = i < roundedRating;
        
        if (!isFilled && !showEmpty) return null;

        return (
          <Star
            key={i}
            size={size}
            className={cn(
              "shrink-0 transition-colors duration-300",
              isFilled 
                ? "text-functional-label-star fill-functional-label-star" 
                : "text-gray-200 fill-none",
              starClassName
            )}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
