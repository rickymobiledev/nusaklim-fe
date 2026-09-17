"use client";

import type { ReactNode } from "react";
import styled from "styled-components";
import { UserManagementSidebar } from "./UserManagementSidebar";

export function UserManagementLayout({ children }: { children: ReactNode }) {
  return (
    <Wrapper>
      <PageTitle>Manajemen</PageTitle>
      <Row>
        <UserManagementSidebar />
        <Content>{children}</Content>
      </Row>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-family: var(--font-heading), sans-serif;
  font-size: 24px;
  line-height: 28px;
  font-weight: 700;
  color: #000000;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;
