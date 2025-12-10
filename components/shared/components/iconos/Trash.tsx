import React from "react";

interface TrashProps extends React.SVGProps<SVGSVGElement> {}

export function Trash(props: TrashProps) {
  const { width = "1em", height = "1em", ...rest } = props;
  return (
    <svg
      {...rest}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
    >
      <title>trash</title>
      <path
        fill="currentColor"
        d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7zm4 12H8v-9h2zm6 0h-2v-9h2zm.618-15L15 2H9L7.382 4H3v2h18V4z"
      />
    </svg>
  );
}

export default Trash;
