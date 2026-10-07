import React from 'react';

export interface LabSIELogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

/**
 * Logotipo Oficial de LabSIE (Laboratorio de Sistemas Inteligentes en Educación)
 * y Grupo EduTLAN (Categoría A MinCiencias · Universidad de Córdoba).
 * 
 * Recreación vectorial fiel al isotipo y logotipo institucional oficial:
 * 1. Microchip superior con pistas y terminales de circuito integrado.
 * 2. Arco orbital superior sobre el wordmark.
 * 3. Logotipo "LABSIE" con ícono cerebral sagital detallado en la raíz central.
 * 4. Subtítulo oficial "Grupo EDUTLAN" con la "T" en verde institucional.
 */
export const LabSIELogo: React.FC<LabSIELogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true
}) => {
  // Configuración de altura responsiva optimizada
  const heightPx = {
    sm: 44, // Header sticky bar
    md: 68, // Tarjetas o paneles
    lg: 110, // Pantalla de bienvenida / Hero
    xl: 140  // Ampliado
  }[size];

  // Proporción oficial: 320 x 200 (1.6:1)
  const widthPx = Math.round(heightPx * 1.6);

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      role="img"
      aria-label="Logotipo oficial de LabSIE y Grupo EduTLAN - Universidad de Córdoba"
    >
      <svg
        viewBox="0 0 320 200"
        height={heightPx}
        width={widthPx}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="shrink-0 transition-transform duration-200"
      >
        <title>Logotipo Oficial LabSIE · Grupo EduTLAN</title>
        <desc>Laboratorio de Sistemas Inteligentes en Educación y Grupo EduTLAN, Universidad de Córdoba</desc>

        {/* 1. MICROCHIP SUPERIOR CON PISTAS Y TERMINALES */}
        <g id="microchip" transform="translate(137, 8)">
          <rect x="0" y="0" width="46" height="42" rx="5" fill="#0E6BA8" />

          {/* Pistas internas de circuito (líneas y nodos en blanco) */}
          <path d="M 12 11 L 22 11 L 22 31 L 34 31" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="11" r="2.2" fill="#FFFFFF" />
          <circle cx="34" cy="31" r="2.2" fill="#FFFFFF" />
          <path d="M 34 11 L 27 11 L 27 20" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="27" cy="20" r="2.2" fill="#FFFFFF" />

          {/* Pines superiores */}
          <line x1="8" y1="0" x2="8" y2="-9" stroke="#0E6BA8" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="8" cy="-9" r="1.5" fill="#0E6BA8" />
          <line x1="16" y1="0" x2="16" y2="-11" stroke="#0E6BA8" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="16" cy="-11" r="1.5" fill="#0E6BA8" />
          <line x1="24" y1="0" x2="24" y2="-11" stroke="#0E6BA8" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="24" cy="-11" r="1.5" fill="#0E6BA8" />
          <line x1="32" y1="0" x2="32" y2="-9" stroke="#0E6BA8" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="32" cy="-9" r="1.5" fill="#0E6BA8" />

          {/* Pines laterales izquierdos */}
          <path d="M 0 10 L -14 10 L -24 0" stroke="#0E6BA8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="-26" cy="0" r="3" fill="#0E6BA8" />
          <path d="M 0 19 L -27 19" stroke="#0E6BA8" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="-29" cy="19" r="3" fill="#0E6BA8" />
          <path d="M 0 28 L -14 28 L -24 37" stroke="#0E6BA8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="-26" cy="38" r="3" fill="#0E6BA8" />

          {/* Pines laterales derechos */}
          <path d="M 46 10 L 60 10 L 70 0" stroke="#0E6BA8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="72" cy="0" r="3" fill="#0E6BA8" />
          <path d="M 46 19 L 73 19" stroke="#0E6BA8" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="75" cy="19" r="3" fill="#0E6BA8" />
          <path d="M 46 28 L 60 28 L 70 37" stroke="#0E6BA8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="72" cy="38" r="3" fill="#0E6BA8" />
        </g>

        {/* Arco orbital curvo superior */}
        <path d="M 65 72 C 115 48, 205 48, 255 72" stroke="#0E6BA8" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.65" />

        {/* 2. WORDMARK: "LA" + CEREBRO DUAL ("B") + "SIE" */}
        <g id="wordmark" transform="translate(12, 60)">
          {/* "LA" en azul oficial */}
          <text x="32" y="58" fontFamily="'DM Sans', 'Arial Rounded MT Bold', sans-serif" fontWeight="900" fontSize="56" fill="#0E6BA8" letterSpacing="-1">
            LA
          </text>

          {/* ÍCONO DE CEREBRO SAGITAL DUAL (Hemisferio Izq Azul, Der Magenta/Fucsia) = "B" */}
          <g id="dual-brain" transform="translate(112, 10)">
            {/* Hemisferio Izquierdo Azul (#0E6BA8) */}
            <path
              d="M 23 2 C 18 2 14 5 12 9 C 8 8 4 11 3 15 C 1 19 3 22 1 26 C 0 30 1 34 3 37 C 1 41 2 45 6 47 C 4 51 7 56 11 58 C 15 60 19 60 23 61 Z"
              fill="#0E6BA8"
            />
            {/* Surcos izquierdos en blanco */}
            <path d="M 23 10 C 17 10 15 14 18 18 C 21 21 19 24 15 23 C 11 22 8 26 12 30" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 23 24 C 19 24 17 29 20 32 C 17 36 12 36 10 40" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 23 40 C 18 40 16 44 19 47 C 16 51 12 52 14 55" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Hemisferio Derecho Magenta / Fucsia (#C2185B) */}
            <path
              d="M 27 2 C 32 2 36 5 38 9 C 42 8 46 11 47 15 C 49 19 47 22 49 26 C 50 30 49 34 47 37 C 49 41 48 45 44 47 C 46 51 43 56 39 58 C 35 60 31 60 27 61 Z"
              fill="#C2185B"
            />
            {/* Surcos derechos en blanco */}
            <path d="M 27 10 C 33 10 35 14 32 18 C 29 21 31 24 35 23 C 39 22 42 26 38 30" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 27 24 C 31 24 33 29 30 32 C 33 36 38 36 40 40" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 27 40 C 32 40 34 44 31 47 C 34 51 38 52 36 55" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Línea divisoria central */}
            <line x1="25" y1="2" x2="25" y2="61" stroke="#FFFFFF" strokeWidth="2" />
          </g>

          {/* "SIE" en azul oficial */}
          <text x="174" y="58" fontFamily="'DM Sans', 'Arial Rounded MT Bold', sans-serif" fontWeight="900" fontSize="56" fill="#0E6BA8" letterSpacing="-1">
            SIE
          </text>
        </g>

        {/* 3. SUBTÍTULO INSTITUCIONAL "Grupo EDUTLAN" */}
        {showSubtitle && (
          <g id="subtitle" transform="translate(160, 168)" textAnchor="middle">
            <text
              fontFamily="'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontWeight="800"
              fontSize="22"
              letterSpacing="-0.3"
            >
              <tspan fill="#0A2540">Grupo </tspan>
              <tspan fill="#0A2540">EDU</tspan>
              <tspan fill="#059669">T</tspan>
              <tspan fill="#0A2540">LAN</tspan>
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
