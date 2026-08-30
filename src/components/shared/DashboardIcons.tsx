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

export function StationIcon({ size = 24, color = "#175FE2", className }: IconProps) {
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
        d="M1.78577 17.1757C3.05862 17.1757 3.05862 17.5605 4.33934 17.5605C5.62005 17.5605 5.6122 17.1757 6.89291 17.1757C8.17362 17.1757 8.16577 17.5605 9.43862 17.5605C10.7115 17.5605 10.7115 17.1757 11.9922 17.1757C13.2729 17.1757 13.2651 17.5605 14.5458 17.5605C15.8265 17.5605 15.8186 17.1757 17.0993 17.1757C18.3801 17.1757 18.3801 17.5605 19.6608 17.5605C20.9415 17.5605 20.9415 17.1757 22.2222 17.1757"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M1.78577 20.8753C3.05862 20.8753 3.05862 21.2601 4.33934 21.2601C5.62005 21.2601 5.6122 20.8753 6.89291 20.8753C8.17362 20.8753 8.16577 21.2601 9.43862 21.2601C10.7115 21.2601 10.7115 20.8753 11.9922 20.8753C13.2729 20.8753 13.2651 21.2601 14.5458 21.2601C15.8265 21.2601 15.8186 20.8753 17.0993 20.8753C18.3801 20.8753 18.3801 21.2601 19.6608 21.2601C20.9415 21.2601 20.9415 20.8753 22.2222 20.8753"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M8.07141 4.78949V17.3681"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M16.125 7.00928H13.375C12.6156 7.00928 12 7.58901 12 8.30413V10.8938C12 11.609 12.6156 12.1887 13.375 12.1887H16.125C16.8844 12.1887 17.5 11.609 17.5 10.8938V8.30413C17.5 7.58901 16.8844 7.00928 16.125 7.00928Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M14.75 12.5587V17.3681"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M4.92861 3.30963L1.89575 9.25118"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M8.0714 9.229L3.41211 6.28412"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
      />
      <path
        d="M18.2072 4.78949C18.2072 4.78949 19.8572 4.78949 20.0379 6.5135"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M19.1736 2.73992C19.1736 2.73992 21.6418 2.73992 22.2143 5.6034"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StationActiveIcon({
  size = 24,
  color = "#43B75D",
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
        d="M2.25 17.055C3.465 17.055 3.465 17.445 4.6875 17.445C5.91 17.445 5.9025 17.055 7.125 17.055C8.3475 17.055 8.34 17.445 9.555 17.445C10.77 17.445 10.77 17.055 11.9925 17.055C13.215 17.055 13.2075 17.445 14.43 17.445C15.6525 17.445 15.645 17.055 16.8675 17.055C18.09 17.055 18.09 17.445 19.3125 17.445C20.535 17.445 20.535 17.055 21.7575 17.055"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M2.25 20.805C3.465 20.805 3.465 21.195 4.6875 21.195C5.91 21.195 5.9025 20.805 7.125 20.805C8.3475 20.805 8.34 21.195 9.555 21.195C10.77 21.195 10.77 20.805 11.9925 20.805C13.215 20.805 13.2075 21.195 14.43 21.195C15.6525 21.195 15.645 20.805 16.8675 20.805C18.09 20.805 18.09 21.195 19.3125 21.195C20.535 21.195 20.535 20.805 21.7575 20.805"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M8.25 4.5V17.25"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M5.24998 3L2.35498 9.0225"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M8.24999 9.00001L3.80249 6.00751"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
      />
      <path
        d="M16.5 14.25C19.3995 14.25 21.75 11.8995 21.75 9C21.75 6.10051 19.3995 3.75 16.5 3.75C13.6005 3.75 11.25 6.10051 11.25 9C11.25 11.8995 13.6005 14.25 16.5 14.25Z"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M14.625 9L15.75 10.125L18 7.875"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StationInactiveIcon({
  size = 24,
  color = "#EE443F",
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
        d="M2.25 17.055C3.465 17.055 3.465 17.445 4.6875 17.445C5.91 17.445 5.9025 17.055 7.125 17.055C8.3475 17.055 8.34 17.445 9.555 17.445C10.77 17.445 10.77 17.055 11.9925 17.055C13.215 17.055 13.2075 17.445 14.43 17.445C15.6525 17.445 15.645 17.055 16.8675 17.055C18.09 17.055 18.09 17.445 19.3125 17.445C20.535 17.445 20.535 17.055 21.7575 17.055"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M2.25 20.805C3.465 20.805 3.465 21.195 4.6875 21.195C5.91 21.195 5.9025 20.805 7.125 20.805C8.3475 20.805 8.34 21.195 9.555 21.195C10.77 21.195 10.77 20.805 11.9925 20.805C13.215 20.805 13.2075 21.195 14.43 21.195C15.6525 21.195 15.645 20.805 16.8675 20.805C18.09 20.805 18.09 21.195 19.3125 21.195C20.535 21.195 20.535 20.805 21.7575 20.805"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M8.25 4.5V17.25"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M5.24998 3L2.35498 9.0225"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M8.24999 9.00001L3.80249 6.00751"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
      />
      <path
        d="M16.5 14.25C19.3995 14.25 21.75 11.8995 21.75 9C21.75 6.10051 19.3995 3.75 16.5 3.75C13.6005 3.75 11.25 6.10051 11.25 9C11.25 11.8995 13.6005 14.25 16.5 14.25Z"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M15 10.5L18 7.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 10.5L15 7.5"
        stroke={color}
        strokeWidth="1.5"
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
