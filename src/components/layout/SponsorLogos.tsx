/**
 * SVG logo components for sponsor attribution.
 * Recreated from official branding to avoid hotlinking.
 */

export function SynopticLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Synoptic"
    >
      {/* Globe with sweep lines */}
      <g>
        {/* Dark globe circle */}
        <circle cx="20" cy="22" r="14" fill="#2D3674" />
        {/* Three sweep lines across the globe */}
        <path
          d="M8 16 Q20 13, 34 18"
          stroke="#6B8EE8"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M6 22 Q20 18, 36 23"
          stroke="#8AAAF0"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M8 28 Q20 24, 34 28"
          stroke="#A8C4F5"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      {/* "Synoptic." text */}
      <text
        x="42"
        y="30"
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="700"
        fontSize="24"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        Synoptic.
      </text>
    </svg>
  );
}

