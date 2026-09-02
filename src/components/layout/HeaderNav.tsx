"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { NAV_ITEMS, getActiveNavHref } from "@/constants";
import { useCurrentUser } from "@/hooks/use-current-user";
import { media } from "@/lib/breakpoints";

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

const Pill = styled(Link)<{ $active: boolean }>`
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
