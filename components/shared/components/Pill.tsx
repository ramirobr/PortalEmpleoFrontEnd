import React from "react";
import { X } from "lucide-react";

interface PillProps {
  children: React.ReactNode;
  variant?: "blue" | "green" | "yellow" | "red" | "gray" | "custom";
  bgColor?: string;
  textColor?: string;
  fontSize?: string;
  className?: string;
  onRemove?: () => void;
  onEdit?: () => void;
  removable?: boolean;
  noButton?: boolean;
}

const Pill: React.FC<PillProps> = ({
  children,
  variant = "blue",
  bgColor,
  textColor,
  fontSize,
  className = "",
  onRemove,
  onEdit,
  removable = false,
  noButton = false,
}) => {
  const isHexColor = (color: string) => /^#([0-9A-F]{3}){1,2}$/i.test(color);

  const getVariantClasses = () => {
    if (variant === "custom") {
      return "";
    }

    switch (variant) {
      case "blue":
        return "bg-blue-100 text-blue-700";
      case "green":
        return "bg-green-100 text-green-700";
      case "yellow":
        return "bg-yellow-100 text-yellow-700";
      case "red":
        return "bg-red-100 text-red-700";
      case "gray":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const variantClasses = getVariantClasses();

  // Build classes for colors if they're Tailwind classes
  const bgColorClass =
    variant === "custom" && bgColor && !isHexColor(bgColor) ? bgColor : "";
  const textColorClass =
    variant === "custom" && textColor && !isHexColor(textColor)
      ? textColor
      : "";

  // Build inline styles for hex colors
  const customStyles: React.CSSProperties = {};
  if (variant === "custom") {
    if (bgColor && isHexColor(bgColor)) {
      customStyles.backgroundColor = bgColor;
    }
    if (textColor && isHexColor(textColor)) {
      customStyles.color = textColor;
    }
  }

  // Handle font size (Tailwind class or custom value)
  const fontSizeClass = fontSize || "text-xs";

  const showRemoveButton = removable && onRemove;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded font-semibold ${variantClasses} ${bgColorClass} ${textColorClass} ${fontSizeClass} ${className}`}
      style={Object.keys(customStyles).length > 0 ? customStyles : undefined}
    >
      {noButton ? (
        children
      ) : (
        <button className="cursor-pointer whitespace-nowrap" onClick={onEdit}>
          {children}
        </button>
      )}

      {showRemoveButton && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="flex items-center justify-center hover:bg-primary/30 rounded-full transition-colors text-current cursor-pointer p-0.5"
          aria-label="Remover"
        >
          <X size={16} className="text-current inline-block font-bold" />
        </button>
      )}
    </span>
  );
};

export default Pill;
