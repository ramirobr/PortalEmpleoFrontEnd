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
        "flex items-center justify-center text-primary w-9 h-9 md:w-12 md:h-12 bg-primary/10 shrink-0",
        variant === "square" && "rounded-lg",
        variant === "rounded" && "rounded-full m-auto",
        className,
      )}
    >
      <Icon
        className={cn(
          "shrink-0 w-6 h-6",
          size ? `md:w-[${size}px] md:h-[${size}px]` : "md:w-8 md:h-8",
        )}
      />
    </div>
  );
}
