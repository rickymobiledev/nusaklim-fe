export type SidebarIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export function DashboardIcon({
  size = 20,
  color = "#8B9C90",
  className,
}: SidebarIconProps) {
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
        d="M2.5 6.06667V3.1C2.5 2.76863 2.76863 2.5 3.1 2.5H7.73333C8.0647 2.5 8.33333 2.76863 8.33333 3.1V6.06667C8.33333 6.39804 8.0647 6.66667 7.73333 6.66667H3.1C2.76863 6.66667 2.5 6.39804 2.5 6.06667Z"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M11.6666 16.9V13.9333C11.6666 13.602 11.9353 13.3333 12.2666 13.3333H16.9C17.2313 13.3333 17.5 13.602 17.5 13.9333V16.9C17.5 17.2314 17.2313 17.5 16.9 17.5H12.2666C11.9353 17.5 11.6666 17.2314 11.6666 16.9Z"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M11.6666 10.2333V3.1C11.6666 2.76863 11.9353 2.5 12.2666 2.5H16.9C17.2313 2.5 17.5 2.76863 17.5 3.1V10.2333C17.5 10.5647 17.2313 10.8333 16.9 10.8333H12.2666C11.9353 10.8333 11.6666 10.5647 11.6666 10.2333Z"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M2.5 16.9V9.76667C2.5 9.4353 2.76863 9.16667 3.1 9.16667H7.73333C8.0647 9.16667 8.33333 9.4353 8.33333 9.76667V16.9C8.33333 17.2314 8.0647 17.5 7.73333 17.5H3.1C2.76863 17.5 2.5 17.2314 2.5 16.9Z"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function MapIcon({ size = 20, color = "#8B9C90", className }: SidebarIconProps) {
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
        d="M12.5 4.16667L7.5 2.5L2.91026 4.02991C2.66526 4.11158 2.5 4.34086 2.5 4.59912L2.5 16.6675C2.5 17.0771 2.90122 17.3663 3.28974 17.2368L7.5 15.8333M12.5 4.16667L16.7103 2.76325C17.0988 2.63374 17.5 2.92292 17.5 3.33246L17.5 15.4009C17.5 15.6591 17.3347 15.8884 17.0897 15.9701L12.5 17.5L7.5 15.8333M7.5 15.8333L7.5 2.5M12.5 17.5L12.5 4.16667"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MonitoringIcon({
  size = 20,
  color = "#8B9C90",
  className,
}: SidebarIconProps) {
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
        d="M1.66663 17.5L14.1666 17.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 17.5L18.3333 17.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.66663 13.5667V3.1C1.66663 2.76863 1.93525 2.5 2.26663 2.5H17.7333C18.0647 2.5 18.3333 2.76863 18.3333 3.1V13.5667C18.3333 13.898 18.0647 14.1667 17.7333 14.1667H2.26663C1.93526 14.1667 1.66663 13.898 1.66663 13.5667Z"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function DownloadIcon({
  size = 20,
  color = "#8B9C90",
  className,
}: SidebarIconProps) {
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
        d="M10 10.8333V18.3333M7.08337 15.4167L10 18.3333L12.9167 15.4167"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.6667 14.6727C17.9115 14.1851 19.1667 13.0741 19.1667 10.8333C19.1667 7.49999 16.3889 6.66666 15 6.66666C15 4.99999 15 1.66666 10 1.66666C5.00004 1.66666 5.00004 4.99999 5.00004 6.66666C3.61115 6.66666 0.833374 7.49999 0.833374 10.8333C0.833374 13.0741 2.0886 14.1851 3.33337 14.6727"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ForecastIcon({
  size = 20,
  color = "#8B9C90",
  className,
}: SidebarIconProps) {
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
        d="M5.00004 10.8333C3.61115 10.8333 0.833374 11.6667 0.833374 15C0.833374 18.3333 3.61115 19.1667 5.00004 19.1667H15C16.3889 19.1667 19.1667 18.3333 19.1667 15C19.1667 11.6667 16.3889 10.8333 15 10.8333"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 10C11.3807 10 12.5 8.88071 12.5 7.5C12.5 6.11929 11.3807 5 10 5C8.61929 5 7.5 6.11929 7.5 7.5C7.5 8.88071 8.61929 10 10 10Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8334 7.5L16.6667 7.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 1.66666V0.833323"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.4166 2.91666L14.5833 3.74999"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.58337 2.91666L5.41671 3.74999"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33337 7.5L4.16671 7.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SidebarToggleIcon({
  size = 20,
  color = "#8B9C90",
  className,
  collapsed,
}: SidebarIconProps & { collapsed: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      style={{ transform: collapsed ? undefined : "scaleX(-1)" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.5 17.5H4.5C3.39543 17.5 2.5 16.6046 2.5 15.5L2.5 4.5C2.5 3.39543 3.39543 2.5 4.5 2.5L15.5 2.5C16.6046 2.5 17.5 3.39543 17.5 4.5V15.5C17.5 16.6046 16.6046 17.5 15.5 17.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.91663 17.5V2.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.58337 8.33334L6.04171 10L4.58337 11.6667"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
