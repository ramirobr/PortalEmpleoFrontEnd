import React from "react";

interface PlusProps extends React.SVGProps<SVGSVGElement> {}

export function Plus(props: PlusProps) {
  const { width = "1em", height = "1em", ...rest } = props;
  return (
    <svg
      {...rest}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
    >
      <title>round-add</title>
      <path
        fill="currentColor"
        d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1"
      />
    </svg>
  );
}

export default Plus;
