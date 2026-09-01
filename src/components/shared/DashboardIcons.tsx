type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export function RefreshDoubleIcon({
  size = 24,
  color = "#175FE2",
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.1693 8C19.6262 4.46819 16.102 2 12.0014 2C6.81606 2 2.55251 5.94668 2.05078 11"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.88146 16C4.42458 19.5318 7.94874 22 12.0494 22C17.2347 22 21.4983 18.0533 22 13"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.04883 16H2.64883C2.31746 16 2.04883 16.2686 2.04883 16.6V21"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WarningTriangleIcon({
  size = 12,
  color = "#FFFFFF",
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.09 1.5C5.47 0.83 6.53 0.83 6.91 1.5L11 8.62C11.38 9.29 10.9 10.13 10.09 10.13H1.91C1.1 10.13 0.62 9.29 1 8.62L5.09 1.5Z"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 4.5V6.5" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <path d="M6 8.25V8.26" stroke={color} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function NavArrowDownIcon({ size = 24, color = "#1D2520", className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
