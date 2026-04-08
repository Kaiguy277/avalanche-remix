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

export function BeadedCloudLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Beaded Cloud"
    >
      {/* Cloud shape */}
      <g>
        <path
          d="M12 30 C6 30, 2 26, 4 22 C2 18, 6 14, 12 14 C13 9, 19 6, 25 8 C29 4, 38 5, 39 10 C44 10, 46 14, 44 18 C48 20, 47 26, 42 28 C42 30, 38 32, 34 30 Z"
          fill="#3B7DD8"
        />
        {/* Data points / "beaded" line inside cloud */}
        <circle cx="14" cy="21" r="1.8" fill="white" />
        <line x1="15.8" y1="21" x2="19.2" y2="18" stroke="white" strokeWidth="1.2" />
        <circle cx="21" cy="17" r="1.8" fill="white" />
        <line x1="22.8" y1="17" x2="26.2" y2="22" stroke="white" strokeWidth="1.2" />
        <circle cx="28" cy="23" r="1.8" fill="white" />
        <line x1="29.8" y1="23" x2="33.2" y2="18" stroke="white" strokeWidth="1.2" />
        <circle cx="35" cy="17" r="1.8" fill="white" />
      </g>
      {/* "beadedcloud" text */}
      <text
        x="54"
        y="29"
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="600"
        fontSize="20"
        fill="currentColor"
        letterSpacing="-0.3"
      >
        beadedcloud
      </text>
    </svg>
  );
}
