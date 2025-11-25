import React from "react";

interface LoaderProps {
  size?: number;
  color?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 40,
  color = "#2563eb",
  className = "",
}) => (
  <div
    className={`flex items-center justify-center ${className}`}
    aria-label="Cargando..."
    role="status"
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      className="animate-spin"
      style={{ display: "inline-block" }}
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray="31.4 31.4"
        strokeLinecap="round"
        opacity="0.2"
      />
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray="31.4 31.4"
        strokeDashoffset="15.7"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export default Loader;
