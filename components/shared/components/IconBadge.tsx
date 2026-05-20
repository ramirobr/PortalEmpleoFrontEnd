import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconBadgeProps {
  icon: LucideIcon;
  variant?: "square" | "rounded";
  className?: string;
  size?: number; // Icon size in pixels
}

export default function IconBadge({
  icon: Icon,
  variant = "square",
  className,
  size,
}: IconBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center text-primary size-9 lg:w-12 lg:h-12 bg-primary/10 shrink-0",
        variant === "square" && "rounded-lg",
        variant === "rounded" && "rounded-full m-auto",
        className,
      )}
    >
      <Icon
        className={cn(
          "shrink-0 size-6",
          size ? `md:w-[${size}px] lg:h-[${size}px]` : "lg:w-8 lg:h-8",
        )}
      />
    </div>
  );
}
