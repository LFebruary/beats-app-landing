import type React from "react";

const Favicon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={32}
      height={32}
      {...props}
    >
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path d="M25,50 L75,50" stroke="currentColor" strokeWidth="4" />
      <path d="M50,70 L40,60 L60,60 Z" fill="currentColor" />
      <text
        x="50"
        y="40"
        textAnchor="middle"
        fontSize="20"
        fontWeight="bold"
        fill="currentColor"
      >
        B
      </text>
    </svg>
  );
};

export default Favicon;
