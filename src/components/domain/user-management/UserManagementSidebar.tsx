"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled, { css } from "styled-components";
import { media } from "@/lib/breakpoints";
import { Building2, Newspaper, Radio, User, Users, type LucideIcon } from "lucide-react";

/** Sub-nav "Manajemen" (BUKAN `NAV_ITEMS` di `constants/index.ts`, jadi
 *  boleh pakai icon lucide-react — pola sama `MonitoringDomainNav.tsx`
 *  yang juga icon lucide placeholder untuk domain yang belum ada asset
 *  PNG Figma-nya). "Pengguna" & "Pengguna Aghris" & "Perusahaan" punya `href` & aktif — 2 item lain
 *  (Stasiun/Berita) sengaja non-klik (fondasi
 *  buat dikerjakan menyusul), lihat CLAUDE.md. */
const MENU_ITEMS: {
  key: string;
  label: string;
  icon: LucideIcon;
  href: string | null;
}[] = [
  { key: "pengguna", label: "Pengguna", icon: User, href: "/user-management/users" },
  {
    key: "pengguna-aghris",
    label: "Pengguna Aghris",
    icon: Users,
    href: "/user-management/aghris-users",
  },
  {
    key: "perusahaan",
    label: "Perusahaan",
    icon: Building2,
    href: "/user-management/companies",
  },
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

/** Mobile: pill-tab horizontal yang bisa digeser (item terakhir boleh
 *  terpotong di tepi, persis Figma). Desktop: kartu putih kolom 256px. */
const Aside = styled.nav`
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 8px;
  padding: 16px 0;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  ${media.desktop} {
    flex-direction: column;
    width: 256px;
    padding: 16px;
    overflow-x: visible;
    background: #ffffff;
    border: 1px solid #ecefed;
    border-radius: 16px;
  }
`;

const itemStyles = css`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 15px 16px;
  white-space: nowrap;
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
  background: ${(p) => (p.$active ? "#175FE2" : "#ffffff")};
  color: ${(p) => (p.$active ? "#ffffff" : "#667A6C")};

  &:hover {
    background: ${(p) => (p.$active ? "#175FE2" : "#F6F8F7")};
  }

  ${media.desktop} {
    width: 100%;
    background: ${(p) => (p.$active ? "#175FE2" : "transparent")};
    color: ${(p) => (p.$active ? "#ffffff" : "#1D2520")};
  }
`;

const DisabledItem = styled.button`
  ${itemStyles}
  background: #ffffff;
  color: #b7bcb9;
  cursor: not-allowed;

  ${media.desktop} {
    width: 100%;
    background: transparent;
  }
`;
