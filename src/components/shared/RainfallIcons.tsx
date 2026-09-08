type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

/** Icon status "Hujan" — dikasih langsung dari desain Figma (bukan
 *  `CloudRain` bawaan lucide-react), dipakai `RainfallTodayLegend.tsx` &
 *  `rainfall-today-map.tsx` (Peta > Curah Hujan Hari Ini). Pola sama
 *  seperti `DashboardIcons.tsx`/`SidebarIcons.tsx`: warna lewat prop
 *  `color`, bukan di-hardcode di path. */
export function RainIcon({ size = 16, color = "#0095FF", className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 9.3335V10.6668"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 13.3335V14.6668"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.3335 12V13.3333"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6665 12V13.3333"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3332 11.7383C14.329 11.3482 15.3332 10.4594 15.3332 8.66683C15.3332 6.00016 13.1109 5.3335 11.9998 5.3335C11.9998 4.00016 11.9998 1.3335 7.99984 1.3335C3.99984 1.3335 3.99984 4.00016 3.99984 5.3335C2.88873 5.3335 0.666504 6.00016 0.666504 8.66683C0.666504 10.4594 1.67069 11.3482 2.6665 11.7383"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Icon status "Tidak Hujan" — dikasih langsung dari desain Figma (bukan
 *  `Sun` bawaan lucide-react), pola sama seperti `RainIcon`. */
export function SunIcon({ size = 16, color = "#EE443F", className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6665 8L15.3332 8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 1.3335V0.666829"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 15.3335V14.6668"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3335 13.3335L12.6668 12.6668"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3335 2.6665L12.6668 3.33317"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.6665 13.3335L3.33317 12.6668"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.6665 2.6665L3.33317 3.33317"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.666504 8L1.33317 8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
