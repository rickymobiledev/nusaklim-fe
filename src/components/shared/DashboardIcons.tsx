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

/** Versi 14px (outline tipis) untuk dot status berdiameter 24px. */
export function AlertTriangleIcon({
  size = 14,
  color = "#FFFFFF",
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.2511 12.2497H3.74856C2.21053 12.2497 1.24808 10.5861 2.01474 9.25274L5.26603 3.59833C6.03504 2.26092 7.96464 2.26092 8.73365 3.59833L11.9849 9.25273C12.7516 10.5861 11.7891 12.2497 10.2511 12.2497Z"
        stroke={color}
        strokeLinecap="round"
      />
      <path d="M7 5.25V7.58333" stroke={color} strokeLinecap="round" />
      <path
        d="M7 9.92283L7.00583 9.91634"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckCircleIcon({ size = 12, color = "#FFFFFF", className }: IconProps) {
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
        d="M3.5 6.25L5 7.75L8.5 4.25"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="6"
        cy="6"
        r="5"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronCircleDownIcon({
  size = 16,
  color = "#43B75D",
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.25" />
      <path
        d="M5.5 7L8 9.5L10.5 7"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

export function SearchIcon({ size = 24, className }: Omit<IconProps, "color">) {
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
        d="M17 17L21 21"
        stroke="#8B9C90"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z"
        stroke="#1D2520"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowDownIcon({ size = 16, color = "#175FE2", className }: IconProps) {
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
        d="M8 3V13M8 13L4.5 9.5M8 13L11.5 9.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NavArrowRightIcon({
  size = 18,
  color = "#175FE2",
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.75 4.5L11.25 9L6.75 13.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DataTransferBothIcon({
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
        d="M17 20V4M14 7L17 4L20 7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 4V20M4 17L7 20L10 17"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ size = 14, color = "#FFFFFF", className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.91675 7.58301L5.25008 9.91634L11.0834 4.08301"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MinusIcon({ size = 14, color = "#FFFFFF", className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3.5 7H10.5" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Versi 20px (outline tebal 1.5) — beda dari `WarningTriangleIcon` 12px di atas. */
export function WarningTriangleLargeIcon({
  size = 20,
  color = "#6B4700",
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.1264 17.4997H3.8738C2.33577 17.4997 1.37332 15.8361 2.13999 14.5027L8.26627 3.84833C9.03528 2.51092 10.9649 2.51092 11.7339 3.84833L17.8602 14.5027C18.6268 15.8361 17.6644 17.4997 16.1264 17.4997Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M10 7.5V10.8333" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M10 14.1753L10.0083 14.1661"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InfoEmptyIcon({ size = 20, color = "#305ECC", className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.99996 18.3334C14.6023 18.3334 18.3333 14.6025 18.3333 10.0001C18.3333 5.39771 14.6023 1.66675 9.99996 1.66675C5.39759 1.66675 1.66663 5.39771 1.66663 10.0001C1.66663 14.6025 5.39759 18.3334 9.99996 18.3334Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 9.58325V13.7499"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 6.25833L10.0083 6.24907"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CalendarOutlineIcon({
  size = 24,
  color = "#1D2520",
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 4H18C19.0609 4 20.0783 4.42143 20.8284 5.17157C21.5786 5.92172 22 6.93913 22 8V18C22 19.0609 21.5786 20.0783 20.8284 20.8284C20.0783 21.5786 19.0609 22 18 22H6C4.93913 22 3.92172 21.5786 3.17157 20.8284C2.42143 20.0783 2 19.0609 2 18V8C2 6.93913 2.42143 5.92172 3.17157 5.17157C3.92172 4.42143 4.93913 4 6 4ZM6 6C5.46957 6 4.96086 6.21071 4.58579 6.58579C4.21071 6.96086 4 7.46957 4 8V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V8C20 7.46957 19.7893 6.96086 19.4142 6.58579C19.0391 6.21071 18.5304 6 18 6H6Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 10C3 9.73478 3.10536 9.48043 3.29289 9.29289C3.48043 9.10536 3.73478 9 4 9H20C20.2652 9 20.5196 9.10536 20.7071 9.29289C20.8946 9.48043 21 9.73478 21 10C21 10.2652 20.8946 10.5196 20.7071 10.7071C20.5196 10.8946 20.2652 11 20 11H4C3.73478 11 3.48043 10.8946 3.29289 10.7071C3.10536 10.5196 3 10.2652 3 10ZM8 2C8.26522 2 8.51957 2.10536 8.70711 2.29289C8.89464 2.48043 9 2.73478 9 3V7C9 7.26522 8.89464 7.51957 8.70711 7.70711C8.51957 7.89464 8.26522 8 8 8C7.73478 8 7.48043 7.89464 7.29289 7.70711C7.10536 7.51957 7 7.26522 7 7V3C7 2.73478 7.10536 2.48043 7.29289 2.29289C7.48043 2.10536 7.73478 2 8 2ZM16 2C16.2652 2 16.5196 2.10536 16.7071 2.29289C16.8946 2.48043 17 2.73478 17 3V7C17 7.26522 16.8946 7.51957 16.7071 7.70711C16.5196 7.89464 16.2652 8 16 8C15.7348 8 15.4804 7.89464 15.2929 7.70711C15.1054 7.51957 15 7.26522 15 7V3C15 2.73478 15.1054 2.48043 15.2929 2.29289C15.4804 2.10536 15.7348 2 16 2Z"
        fill={color}
      />
      <path
        d="M8 13C8 13.2652 7.89464 13.5196 7.70711 13.7071C7.51957 13.8946 7.26522 14 7 14C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13C6 12.7348 6.10536 12.4804 6.29289 12.2929C6.48043 12.1054 6.73478 12 7 12C7.26522 12 7.51957 12.1054 7.70711 12.2929C7.89464 12.4804 8 12.7348 8 13ZM8 17C8 17.2652 7.89464 17.5196 7.70711 17.7071C7.51957 17.8946 7.26522 18 7 18C6.73478 18 6.48043 17.8946 6.29289 17.7071C6.10536 17.5196 6 17.2652 6 17C6 16.7348 6.10536 16.4804 6.29289 16.2929C6.48043 16.1054 6.73478 16 7 16C7.26522 16 7.51957 16.1054 7.70711 16.2929C7.89464 16.4804 8 16.7348 8 17ZM13 13C13 13.2652 12.8946 13.5196 12.7071 13.7071C12.5196 13.8946 12.2652 14 12 14C11.7348 14 11.4804 13.8946 11.2929 13.7071C11.1054 13.5196 11 13.2652 11 13C11 12.7348 11.1054 12.4804 11.2929 12.2929C11.4804 12.1054 11.7348 12 12 12C12.2652 12 12.5196 12.1054 12.7071 12.2929C12.8946 12.4804 13 12.7348 13 13ZM13 17C13 17.2652 12.8946 17.5196 12.7071 17.7071C12.5196 17.8946 12.2652 18 12 18C11.7348 18 11.4804 17.8946 11.2929 17.7071C11.1054 17.5196 11 17.2652 11 17C11 16.7348 11.1054 16.4804 11.2929 16.2929C11.4804 16.1054 11.7348 16 12 16C12.2652 16 12.5196 16.1054 12.7071 16.2929C12.8946 16.4804 13 16.7348 13 17ZM18 13C18 13.2652 17.8946 13.5196 17.7071 13.7071C17.5196 13.8946 17.2652 14 17 14C16.7348 14 16.4804 13.8946 16.2929 13.7071C16.1054 13.5196 16 13.2652 16 13C16 12.7348 16.1054 12.4804 16.2929 12.2929C16.4804 12.1054 16.7348 12 17 12C17.2652 12 17.5196 12.1054 17.7071 12.2929C17.8946 12.4804 18 12.7348 18 13ZM18 17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18C16.7348 18 16.4804 17.8946 16.2929 17.7071C16.1054 17.5196 16 17.2652 16 17C16 16.7348 16.1054 16.4804 16.2929 16.2929C16.4804 16.1054 16.7348 16 17 16C17.2652 16 17.5196 16.1054 17.7071 16.2929C17.8946 16.4804 18 16.7348 18 17Z"
        fill={color}
      />
    </svg>
  );
}

export function WarningCircleIcon({
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
        d="M6 3.5L6 6.5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 8.505L6.005 8.49944"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function JournalIcon({ size = 20, color = "#175FE2", className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#journal-icon-clip)">
        <path
          d="M5 5L15 5"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 8.33325H15"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.8333 11.6667L15 11.6667"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.8333 15L15 15"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.66666 17.7334V2.26675C1.66666 1.93538 1.93528 1.66675 2.26666 1.66675H17.7333C18.0647 1.66675 18.3333 1.93538 18.3333 2.26675V17.7334C18.3333 18.0648 18.0647 18.3334 17.7333 18.3334H2.26666C1.93529 18.3334 1.66666 18.0648 1.66666 17.7334Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 15.0001V11.6667H7.5V15.0001H5Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="journal-icon-clip">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

/** Icon per-item popup Notifikasi (`NotificationButton.tsx`) — BEDA dari
 *  icon trigger tombolnya sendiri (tetap `Bell` lucide-react yang sudah
 *  ada). */
export function BellNotificationIcon({
  size = 24,
  color = "#175FE2",
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
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
        d="M18.1336 11C18.7155 16.3755 21 18 21 18H3C3 18 6 15.8667 6 8.4C6 6.70261 6.63214 5.07475 7.75736 3.87452C8.88258 2.67428 10.4087 2 12 2C12.3373 2 12.6717 2.0303 13 2.08949"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.7295 21C13.5537 21.3031 13.3014 21.5547 12.9978 21.7295C12.6941 21.9044 12.3499 21.9965 11.9995 21.9965C11.6492 21.9965 11.3049 21.9044 11.0013 21.7295C10.6977 21.5547 10.4453 21.3031 10.2695 21"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Icon "Stasiun" (halaman Missing Data, kartu Stasiun Terdampak) — SVG
 *  dari Figma, viewBox 32x32 asli. */
export function StationIcon({ size = 32, color = "#175FE2", className }: IconProps) {
  const stroke = { stroke: color, strokeWidth: 2, strokeMiterlimit: 10 } as const;
  const round = { ...stroke, strokeLinecap: "round" } as const;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.38098 22.9004C4.07812 22.9004 4.07812 23.4134 5.78574 23.4134C7.49336 23.4134 7.48289 22.9004 9.1905 22.9004C10.8981 22.9004 10.8876 23.4134 12.5848 23.4134C14.2819 23.4134 14.2819 22.9004 15.9896 22.9004C17.6972 22.9004 17.6867 23.4134 19.3943 23.4134C21.1019 23.4134 21.0915 22.9004 22.7991 22.9004C24.5067 22.9004 24.5067 23.4134 26.2143 23.4134C27.9219 23.4134 27.9219 22.9004 29.6296 22.9004"
        {...round}
      />
      <path
        d="M2.38098 27.834C4.07812 27.834 4.07812 28.347 5.78574 28.347C7.49336 28.347 7.48289 27.834 9.1905 27.834C10.8981 27.834 10.8876 28.347 12.5848 28.347C14.2819 28.347 14.2819 27.834 15.9896 27.834C17.6972 27.834 17.6867 28.347 19.3943 28.347C21.1019 28.347 21.0915 27.834 22.7991 27.834C24.5067 27.834 24.5067 28.347 26.2143 28.347C27.9219 28.347 27.9219 27.834 29.6296 27.834"
        {...round}
      />
      <path d="M10.7619 6.38672V23.1582" {...round} />
      <path
        d="M21.5 9.3457H17.8333C16.8208 9.3457 16 10.1187 16 11.0722V14.5251C16 15.4786 16.8208 16.2516 17.8333 16.2516H21.5C22.5125 16.2516 23.3333 15.4786 23.3333 14.5251V11.0722C23.3333 10.1187 22.5125 9.3457 21.5 9.3457Z"
        {...stroke}
        strokeLinejoin="round"
      />
      <path d="M19.6667 16.7441V23.1568" {...round} />
      <path d="M6.57146 4.41211L2.52765 12.3342" {...round} />
      <path d="M10.7619 12.3054L4.5495 8.37891" {...stroke} />
      <path
        d="M24.2762 6.38672C24.2762 6.38672 26.4762 6.38672 26.7171 8.6854"
        {...round}
      />
      <path
        d="M25.5648 3.65257C25.5648 3.65257 28.8557 3.65257 29.619 7.47055"
        {...round}
      />
    </svg>
  );
}

/** Icon "import" (unduh ke tray) — tombol Import & link template di
 *  halaman Missing Data. viewBox 20x20 asli Figma. */
export function ImportIcon({ size = 20, color = "#175FE2", className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.33331 10.834L3.33331 15.5007C3.33331 16.6052 4.22874 17.5007 5.33331 17.5007H14.6666C15.7712 17.5007 16.6666 16.6052 16.6666 15.5007V10.834"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 2.5L10 12.5M12.9167 9.58333L10 12.5L7.08335 9.58333"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Icon "submit-document" (dokumen + panah) — tombol Pilih File di halaman
 *  Missing Data. viewBox 24x24 asli Figma. */
export function SubmitDocumentIcon({
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
        d="M20 13V5.74853C20 5.5894 19.9368 5.43679 19.8243 5.32426L16.6757 2.17574C16.5632 2.06321 16.4106 2 16.2515 2H4.6C4.26863 2 4 2.26863 4 2.6V21.4C4 21.7314 4.26863 22 4.6 22H14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 2V5.4C16 5.73137 16.2686 6 16.6 6H20"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 19H22M19 22L22 19L19 16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
