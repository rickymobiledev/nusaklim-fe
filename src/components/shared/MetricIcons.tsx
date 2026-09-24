/** Ikon metrik kartu Ramalan Cuaca (Figma, viewBox 18×18, outline 1.5px) —
 *  pola sama `DashboardIcons.tsx`: warna di-set pemanggil, default biru
 *  primary. */
type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

function MetricSvg({
  size,
  className,
  children,
}: {
  size: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

const strokeProps = {
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function TemperatureLowIcon({
  size = 18,
  color = "#175FE2",
  className,
}: IconProps) {
  return (
    <MetricSvg size={size} className={className}>
      <path
        d="M4.5 9C3.58917 9.68415 3 10.7734 3 12.0003C3 14.0713 4.67893 15.7503 6.75 15.7503C8.82107 15.7503 10.5 14.0713 10.5 12.0003C10.5 10.7734 9.91083 9.68415 9 9"
        stroke={color}
        {...strokeProps}
      />
      <path d="M4.5 9V2.25H9V9" stroke={color} {...strokeProps} />
      <path d="M9 2.25L10.5 2.25" stroke={color} {...strokeProps} />
      <path d="M9 4.5L10.5 4.5" stroke={color} {...strokeProps} />
      <path d="M9 6.75L10.5 6.75" stroke={color} {...strokeProps} />
      <path
        d="M14.25 5.25C15.0784 5.25 15.75 4.57843 15.75 3.75C15.75 2.92157 15.0784 2.25 14.25 2.25C13.4216 2.25 12.75 2.92157 12.75 3.75C12.75 4.57843 13.4216 5.25 14.25 5.25Z"
        stroke={color}
        {...strokeProps}
      />
      <path
        d="M6.75 10.5C5.92157 10.5 5.25 11.1716 5.25 12C5.25 12.8284 5.92157 13.5 6.75 13.5C7.57843 13.5 8.25 12.8284 8.25 12C8.25 11.1716 7.57843 10.5 6.75 10.5ZM6.75 10.5V8.25"
        stroke={color}
        {...strokeProps}
      />
    </MetricSvg>
  );
}

export function DropletHalfIcon({ size = 18, color = "#175FE2", className }: IconProps) {
  return (
    <MetricSvg size={size} className={className}>
      <path d="M3.375 12.375L13.875 7.5" stroke={color} strokeWidth={1.5} />
      <path
        d="M15 10.5C15 7.18629 9 1.5 9 1.5C9 1.5 3 7.18629 3 10.5C3 13.8137 5.68629 16.5 9 16.5C12.3137 16.5 15 13.8137 15 10.5Z"
        stroke={color}
        strokeWidth={1.5}
      />
    </MetricSvg>
  );
}

export function SunLightIcon({ size = 18, color = "#175FE2", className }: IconProps) {
  return (
    <MetricSvg size={size} className={className}>
      <path
        d="M9 13.5C11.4853 13.5 13.5 11.4853 13.5 9C13.5 6.51472 11.4853 4.5 9 4.5C6.51472 4.5 4.5 6.51472 4.5 9C4.5 11.4853 6.51472 13.5 9 13.5Z"
        stroke={color}
        {...strokeProps}
      />
      <path d="M16.5 9L17.25 9" stroke={color} {...strokeProps} />
      <path d="M9 1.5V0.75" stroke={color} {...strokeProps} />
      <path d="M9 17.25V16.5" stroke={color} {...strokeProps} />
      <path d="M15 15L14.25 14.25" stroke={color} {...strokeProps} />
      <path d="M15 3L14.25 3.75" stroke={color} {...strokeProps} />
      <path d="M3 15L3.75 14.25" stroke={color} {...strokeProps} />
      <path d="M3 3L3.75 3.75" stroke={color} {...strokeProps} />
      <path d="M0.75 9L1.5 9" stroke={color} {...strokeProps} />
    </MetricSvg>
  );
}

export function CompressIcon({ size = 18, color = "#175FE2", className }: IconProps) {
  return (
    <MetricSvg size={size} className={className}>
      <path d="M13.5 9L4.5 9" stroke={color} {...strokeProps} />
      <path d="M9 16.5V12M6.75 14.25L9 12L11.25 14.25" stroke={color} {...strokeProps} />
      <path d="M9 1.5V6M6.75 3.75L9 6L11.25 3.75" stroke={color} {...strokeProps} />
    </MetricSvg>
  );
}

export function WindIcon({ size = 18, color = "#175FE2", className }: IconProps) {
  return (
    <MetricSvg size={size} className={className}>
      <path
        d="M13.7089 5.25C14.8362 5.25 15.75 6.08947 15.75 7.125C15.75 8.16053 14.8362 9 13.7089 9H2.25"
        stroke={color}
        {...strokeProps}
      />
      <path
        d="M13.4531 15C14.3074 15 15.375 14.625 15.375 13.125C15.375 11.625 14.3074 11.25 13.4531 11.25H2.25"
        stroke={color}
        {...strokeProps}
      />
      <path
        d="M7.80882 3C8.88091 3 9.75 3.83947 9.75 4.875C9.75 5.91053 8.88091 6.75 7.80882 6.75H2.25"
        stroke={color}
        {...strokeProps}
      />
    </MetricSvg>
  );
}

export function CompassIcon({ size = 18, color = "#175FE2", className }: IconProps) {
  return (
    <MetricSvg size={size} className={className}>
      <path
        d="M7.93906 7.93887L12.712 5.28722L10.0604 10.0602L5.28741 12.7118L7.93906 7.93887Z"
        stroke={color}
        {...strokeProps}
      />
      <path
        d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
        stroke={color}
        {...strokeProps}
      />
    </MetricSvg>
  );
}
