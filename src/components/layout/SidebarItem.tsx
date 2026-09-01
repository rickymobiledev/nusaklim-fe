"use client";

import Link from "next/link";
import styled from "styled-components";
import type { SidebarIconProps } from "@/components/shared/SidebarIcons";
import type { ComponentType } from "react";

export function SidebarItem({
  href,
  icon: Icon,
  label,
  active,
  onNavigate,
}: {
  href: string;
  icon: ComponentType<SidebarIconProps>;
  label: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <StyledLink href={href} $active={active} onClick={onNavigate}>
      <Icon size={20} color={active ? "#FFFFFF" : "#8B9C90"} className="shrink-0" />
      <Label>{label}</Label>
    </StyledLink>
  );
}

const StyledLink = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 10px;
  width: 100%;
  padding: 12px;
  border-radius: 9999px;
  background: ${(p) => (p.$active ? "#175FE2" : "#ffffff")};
  color: ${(p) => (p.$active ? "#ffffff" : "#667A6C")};
  box-shadow: ${(p) => (p.$active ? "0px 4px 8.7px 0px #00000026" : "none")};
  transition:
    background-color 0.15s,
    color 0.15s;
`;

const Label = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
