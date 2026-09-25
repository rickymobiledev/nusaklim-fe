"use client";

import styled from "styled-components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { media } from "@/lib/breakpoints";
import type { Company } from "@/types/user-management";
import { CompanyLogo } from "./CompanyLogo";

/** Grid kartu perusahaan (Figma "Frame 16"): 1 kolom di mobile, 3 kolom di
 *  desktop. Tombol ⋮ membuka dropdown Lihat / Ubah Data / Hapus Data (pola
 *  sama Pengguna); "Lihat" membuka popup detail (`CompanyDetailDialog`). */
export function CompaniesGrid({
  companies,
  onView,
  onEdit,
  onDelete,
}: {
  companies: Company[];
  onView: (company: Company) => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}) {
  return (
    <Grid>
      {companies.map((company) => (
        <CompanyCard key={company.id}>
          <CompanyLogo imageUrl={company.imageUrl} name={company.name} />
          <Info>
            <Name>{company.name}</Name>
            <Code>{company.code}</Code>
          </Info>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreButton type="button" aria-label={`Menu ${company.name}`}>
                <MoreVertIcon />
              </MoreButton>
            </DropdownMenuTrigger>
            <MenuContent align="end">
              <MenuItem onSelect={() => onView(company)}>
                <EyeIcon />
                Lihat
              </MenuItem>
              <MenuItem onSelect={() => onEdit(company)}>
                <PencilIcon />
                Ubah Data
              </MenuItem>
              <MenuItem variant="destructive" onSelect={() => onDelete(company)}>
                <TrashIcon />
                Hapus Data
              </MenuItem>
            </MenuContent>
          </DropdownMenu>
        </CompanyCard>
      ))}
    </Grid>
  );
}

export function MoreVertIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="5.5" r="1.5" fill="#1D2520" />
      <circle cx="12" cy="12" r="1.5" fill="#1D2520" />
      <circle cx="12" cy="18.5" r="1.5" fill="#1D2520" />
    </svg>
  );
}

export function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 11.6663C10.9205 11.6663 11.6667 10.9201 11.6667 9.99967C11.6667 9.0792 10.9205 8.33301 10 8.33301C9.07957 8.33301 8.33337 9.0792 8.33337 9.99967C8.33337 10.9201 9.07957 11.6663 10 11.6663Z"
        stroke="#455249"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 10C15.9262 12.4925 13.0986 15 10 15C6.90141 15 4.0738 12.4925 2.5 10C4.41546 7.63187 6.65969 5 10 5C13.3403 5 15.5846 7.63183 17.5 10Z"
        stroke="#1D2520"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PencilIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9693 4.70931L12.9669 3.71169C13.7479 2.93064 15.0143 2.93064 15.7953 3.71169L16.5024 4.41879C17.2835 5.19984 17.2835 6.46617 16.5024 7.24722L15.5048 8.24484M11.9693 4.70931L4.04188 12.6367C3.7098 12.9688 3.50518 13.4071 3.46385 13.8749L3.29028 15.8397C3.23551 16.4597 3.75439 16.9786 4.3744 16.9238L6.33919 16.7502C6.807 16.7089 7.24534 16.5043 7.57741 16.1722L15.5048 8.24484M11.9693 4.70931L15.5048 8.24484"
        stroke="#455249"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.6667 7.5L15.0042 16.9552C14.8641 17.7522 14.1719 18.3333 13.3628 18.3333H6.63732C5.8282 18.3333 5.13596 17.7522 4.99584 16.9552L3.33337 7.5"
        stroke="#455249"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 5.00033H12.8125M2.5 5.00033H7.1875M7.1875 5.00033V3.33366C7.1875 2.41318 7.93369 1.66699 8.85417 1.66699H11.1458C12.0663 1.66699 12.8125 2.41318 12.8125 3.33366V5.00033M7.1875 5.00033H12.8125"
        stroke="#455249"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;

  ${media.desktop} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const CompanyCard = styled.div`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 200px;
  padding: 16px 24px;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 16px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  max-width: 100%;
`;

const Name = styled.p`
  margin: 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
  color: #1d2520;
`;

const Code = styled.p`
  margin: 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #1d2520;
`;

const MoreButton = styled.button`
  position: absolute;
  top: 10px;
  right: 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: #ffffff;
  border: 1px solid #d6dcd8;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #f6f8f7;
  }
`;

const MenuContent = styled(DropdownMenuContent)`
  display: flex;
  flex-direction: column;
  min-width: 218px;
  padding: 16px;
  gap: 0;
  border: none;
  border-radius: 16px;
  box-shadow: 0px 4px 26px rgba(0, 0, 0, 0.25);
`;

const MenuItem = styled(DropdownMenuItem)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 12px;
  border-radius: 50px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #455249;
`;
