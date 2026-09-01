"use client";

import { PanelLeft } from "lucide-react";
import styled from "styled-components";
import { Logo } from "@/components/shared/Logo";
import { HeaderNav } from "@/components/layout/HeaderNav";
import { NotificationButton } from "@/components/shared/NotificationButton";
import { UserMenu } from "@/components/layout/UserMenu";
import { useSidebarStore } from "@/hooks/use-sidebar-store";
import { media } from "@/lib/breakpoints";

export function Topbar() {
  const toggleMobile = useSidebarStore((state) => state.toggleMobile);

  return (
    <HeaderRoot>
      <LeftSection>
        <HamburgerButton
          type="button"
          onClick={toggleMobile}
          aria-label="Buka menu navigasi"
        >
          <PanelLeft size={22} color="#1D2520" strokeWidth={1.5} />
        </HamburgerButton>
        <Logo variant="header" />
      </LeftSection>
      <HeaderNav />
      <RightSection>
        <NotificationButton />
        <UserMenu />
      </RightSection>
    </HeaderRoot>
  );
}

const HeaderRoot = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;
  border-bottom: 1px solid #bbd3ff;
  background-color: #F5F7FB;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HamburgerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 9999px;
  background: transparent;
  cursor: pointer;

  ${media.desktop} {
    display: none;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 14.5px 0;
`;
