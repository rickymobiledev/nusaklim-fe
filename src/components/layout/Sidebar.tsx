"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { NAV_ITEMS, getActiveNavHref } from "@/constants";
import { useSidebarStore } from "@/hooks/use-sidebar-store";
import { useCurrentUser } from "@/hooks/use-current-user";
import { media } from "@/lib/breakpoints";
import { SidebarItem } from "./SidebarItem";

export function Sidebar() {
  const pathname = usePathname();
  const { mobileOpen, closeMobile } = useSidebarStore();
  const { user } = useCurrentUser();
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user?.role && item.roles.includes(user.role)),
  );
  const activeHref = getActiveNavHref(pathname);

  return (
    <>
      <Backdrop $open={mobileOpen} onClick={closeMobile} aria-hidden />
      <Aside $open={mobileOpen} aria-label="Navigasi utama" aria-hidden={!mobileOpen}>
        <DrawerHeader>
          <CloseButton
            type="button"
            onClick={closeMobile}
            aria-label="Tutup menu navigasi"
          >
            <X size={20} color="#667A6C" strokeWidth={1.5} />
          </CloseButton>
        </DrawerHeader>

        <NavList>
          {visibleItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={item.href === activeHref}
              onNavigate={closeMobile}
            />
          ))}
        </NavList>

        <Footer>
          <FooterVersion>Nusaklim v2.0</FooterVersion>
          <FooterCopyright>2026 Nusaklim, All right Reserved</FooterCopyright>
        </Footer>
      </Aside>
    </>
  );
}

const Backdrop = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(0, 0, 0, 0.4);
  opacity: ${(p) => (p.$open ? 1 : 0)};
  pointer-events: ${(p) => (p.$open ? "auto" : "none")};
  transition: opacity 0.25s ease;

  ${media.desktop} {
    display: none;
  }
`;

const Aside = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  width: 350px;
  max-width: 85vw;
  background: #ffffff;
  border-right: 1px solid #bbd3ff;
  padding: 16px 0 0px;
  transform: translateX(${(p) => (p.$open ? "0" : "-100%")});
  transition: transform 0.25s ease;

  ${media.desktop} {
    display: none;
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 24px 16px;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 9999px;
  background: transparent;
  cursor: pointer;
`;

const NavList = styled.nav`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 0 16px;
  overflow-y: auto;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 24px;
  border-top: 1px solid #bbd3ff;
`;

const FooterVersion = styled.p`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #1d2520;
`;

const FooterCopyright = styled.p`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #667a6c;
`;
