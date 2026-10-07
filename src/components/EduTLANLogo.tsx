import React from 'react';

interface EduTLANLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showCategoryBadge?: boolean;
}

export const EduTLANLogo: React.FC<EduTLANLogoProps> = ({
  className = '',
  size = 'md',
  showCategoryBadge = true
}) => {
  // Height configurations
  const height = size === 'sm' ? 44 : size === 'lg' ? 84 : 60;
  const width = Math.round(height * 1.6);

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <svg
        viewBox="0 0 460 220"
        height={height}
        width={width}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Orbital swoosh arc */}
        <path
          d="M 32 165 C 20 145 28 85 140 45 C 230 12 340 32 380 75"
          stroke="#0F4C5C"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 320 40 C 345 48 375 62 385 85"
          stroke="#059669"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Satellite Node / Circle */}
        <circle cx="330" cy="38" r="14" fill="#059669" />

        {/* Wordmark EDUTLAN */}
        {/* EDU */}
        <text
          x="35"
          y="132"
          fontFamily="'DM Sans', 'Arial Rounded MT Bold', sans-serif"
          fontWeight="800"
          fontSize="92"
          fill="#0F4C5C"
          letterSpacing="-1"
        >
          EDU
        </text>

        {/* T (in vibrant Emerald Green) */}
        <text
          x="238"
          y="132"
          fontFamily="'DM Sans', 'Arial Rounded MT Bold', sans-serif"
          fontWeight="800"
          fontSize="92"
          fill="#059669"
          letterSpacing="-1"
        >
          T
        </text>

        {/* LAN */}
        <text
          x="298"
          y="132"
          fontFamily="'DM Sans', 'Arial Rounded MT Bold', sans-serif"
          fontWeight="800"
          fontSize="92"
          fill="#0F4C5C"
          letterSpacing="-1"
        >
          LAN
        </text>

        {/* Tagline: Education | Technology | Language */}
        <text
          x="42"
          y="160"
          fontFamily="'DM Sans', sans-serif"
          fontWeight="500"
          fontSize="22"
          fill="#0F4C5C"
          letterSpacing="1"
        >
          Education | Technology | Language
        </text>

        {/* Miniciencias line */}
        <text
          x="88"
          y="192"
          fontFamily="'DM Sans', sans-serif"
          fontWeight="500"
          fontSize="15"
          fill="#526066"
        >
          Minciencias code: COL0065564
        </text>

        <text
          x="280"
          y="192"
          fontFamily="'DM Sans', sans-serif"
          fontWeight="600"
          fontSize="15"
          fill="#334155"
          letterSpacing="0.5"
        >
          RESEARCH GROUP
        </text>

        {/* MinCiencias Categoría A Badge (Gold Ribbon Medal) */}
        {showCategoryBadge && (
          <g transform="translate(382, 130)">
            {/* Ribbon Tails */}
            <path d="M 12 40 L 5 70 L 22 58 L 32 70 L 25 40 Z" fill="#D97706" />
            <path d="M 22 40 L 15 70 L 32 58 L 42 70 L 35 40 Z" fill="#F59E0B" />

            {/* Scalloped Gold Medal */}
            <circle cx="28" cy="24" r="26" fill="#F59E0B" />
            <circle cx="28" cy="24" r="22" fill="#FBBF24" />

            {/* Inner Ring */}
            <circle cx="28" cy="24" r="19" fill="#F59E0B" />
            <circle cx="28" cy="24" r="17" fill="#FBBF24" />

            {/* Letter 'A' */}
            <text
              x="28"
              y="32"
              textAnchor="middle"
              fontFamily="'Lora', Georgia, serif"
              fontWeight="900"
              fontSize="24"
              fill="#FFFDF9"
            >
              A
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
