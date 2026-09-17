"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled, { css } from "styled-components";
import { Building2, Newspaper, Radio, User, Users, type LucideIcon } from "lucide-react";

/** Sub-nav "Manajemen" (BUKAN `NAV_ITEMS` di `constants/index.ts`, jadi
 *  boleh pakai icon lucide-react — pola sama `MonitoringDomainNav.tsx`
 *  yang juga icon lucide placeholder untuk domain yang belum ada asset
 *  PNG Figma-nya). Cuma "Pengguna" yang punya `href` & aktif — 4 item lain
 *  (Pengguna Aghris/Perusahaan/Stasiun/Berita) sengaja non-klik (fondasi
 *  buat dikerjakan menyusul), lihat CLAUDE.md. */
const MENU_ITEMS: {
  key: string;
  label: string;
  icon: LucideIcon;
  href: string | null;
}[] = [
  { key: "pengguna", label: "Pengguna", icon: User, href: "/user-management/users" },
  { key: "pengguna-aghris", label: "Pengguna Aghris", icon: Users, href: null },
  { key: "perusahaan", label: "Perusahaan", icon: Building2, href: null },
  { key: "stasiun", label: "Stasiun", icon: Radio, href: null },
  { key: "berita", label: "Berita", icon: Newspaper, href: null },
];

export function UserManagementSidebar() {
  const pathname = usePathname();

  return (
    <Aside aria-label="Navigasi Manajemen">
      {MENU_ITEMS.map((item) => {
        const Icon = item.icon;

        if (!item.href) {
          return (
            <DisabledItem key={item.key} type="button" disabled title="Segera hadir">
              <Icon size={20} />
              {item.label}
            </DisabledItem>
          );
        }

        return (
          <MenuLink
            key={item.key}
            href={item.href}
            $active={pathname.startsWith(item.href)}
          >
            <Icon size={20} />
            {item.label}
          </MenuLink>
        );
      })}
    </Aside>
  );
}

const Aside = styled.nav`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 8px;
  width: 256px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 16px;
`;

const itemStyles = css`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 15px 16px;
  border: none;
  border-radius: 8px;
  font-family: var(--font-body), sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  transition:
    background-color 0.15s,
    color 0.15s;
`;

const MenuLink = styled(Link)<{ $active: boolean }>`
  ${itemStyles}
  background: ${(p) => (p.$active ? "#175FE2" : "transparent")};
  color: ${(p) => (p.$active ? "#ffffff" : "#1D2520")};

  &:hover {
    background: ${(p) => (p.$active ? "#175FE2" : "#F6F8F7")};
  }
`;

const DisabledItem = styled.button`
  ${itemStyles}
  background: transparent;
  color: #b7bcb9;
  cursor: not-allowed;
`;
