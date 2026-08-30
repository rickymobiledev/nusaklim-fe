"use client";

import styled from "styled-components";
import { Logo } from "@/components/shared/Logo";
import { NotificationButton } from "@/components/shared/NotificationButton";
import { UserMenu } from "@/components/layout/UserMenu";

export function Topbar() {
  return (
    <HeaderRoot>
      <Logo showTagline={false} />
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
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 14.5px 0;
`;
