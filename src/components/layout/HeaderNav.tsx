"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled, { css } from "styled-components";
import { NAV_ITEMS, getActiveNavHref } from "@/constants";
import { useCurrentUser } from "@/hooks/use-current-user";
import { media } from "@/lib/breakpoints";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function HeaderNav() {
  const pathname = usePathname();
  const { user } = useCurrentUser();
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user?.role && item.roles.includes(user.role)),
  );
  const activeHref = getActiveNavHref(pathname);

  return (
    <Nav aria-label="Navigasi utama">
      {visibleItems.map((item) => {
        const active = item.href === activeHref;

        // Item dengan `children` (mis. "Lainnya") dirender sebagai dropdown,
        // BUKAN link langsung — isi dropdown-nya yang jadi tujuan navigasi.
        if (item.children) {
          return (
            <DropdownMenu key={item.href}>
              <DropdownMenuTrigger asChild>
                <PillButton type="button" $active={active}>
                  <item.icon size={20} color={active ? "#ffffff" : "#455249"} />
                  {item.label}
                </PillButton>
              </DropdownMenuTrigger>
              <MoreMenuContent align="center">
                {item.children.map((child) =>
                  child.disabled ? (
                    <MoreMenuItemDisabled key={child.href}>
                      <child.icon size={20} color="#B7C2BB" />
                      {child.label}
                    </MoreMenuItemDisabled>
                  ) : (
                    <MoreMenuItem key={child.href} asChild>
                      <Link href={child.href}>
                        <child.icon size={20} color="#455249" />
                        {child.label}
                      </Link>
                    </MoreMenuItem>
                  ),
                )}
              </MoreMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <Pill key={item.href} href={item.href} $active={active}>
            <item.icon size={20} color={active ? "#ffffff" : "#455249"} />
            {item.label}
          </Pill>
        );
      })}
    </Nav>
  );
}

const Nav = styled.nav`
  display: none;

  ${media.desktop} {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 16px;
  }
`;

const pillStyles = css<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 36px;
  padding: 8px 12px;
  border-radius: 9999px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  white-space: nowrap;
  background: ${(p) => (p.$active ? "#175FE2" : "transparent")};
  color: ${(p) => (p.$active ? "#ffffff" : "#455249")};
  box-shadow: ${(p) => (p.$active ? "0px 8px 8.7px rgba(0, 0, 0, 0.15)" : "none")};
  transition:
    background-color 0.15s,
    color 0.15s;
`;

const Pill = styled(Link)<{ $active: boolean }>`
  ${pillStyles}
`;

const PillButton = styled.button<{ $active: boolean }>`
  ${pillStyles}
  border: none;
  cursor: pointer;
`;

const MoreMenuContent = styled(DropdownMenuContent)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 250px;
  padding: 16px;
  background: #ffffff;
  border: none;
  border-radius: 16px;
  box-shadow: 0px 4px 26px rgba(0, 0, 0, 0.25);
`;

const menuItemStyles = css`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 44px;
  padding: 12px;
  border-radius: 9999px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
`;

const MoreMenuItem = styled(DropdownMenuItem)`
  ${menuItemStyles}
  color: #455249;

  &:hover,
  &:focus {
    background: #f6f8f7;
  }
`;

const MoreMenuItemDisabled = styled.div`
  ${menuItemStyles}
  color: #b7c2bb;
  cursor: not-allowed;
`;
