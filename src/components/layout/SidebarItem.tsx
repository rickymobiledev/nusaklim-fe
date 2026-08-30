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
  collapsed,
}: {
  href: string;
  icon: ComponentType<SidebarIconProps>;
  label: string;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <StyledLink href={href} title={label} $active={active} $collapsed={collapsed}>
      <Icon size={20} color={active ? "#FFFFFF" : "#8B9C90"} className="shrink-0" />
      <Label $collapsed={collapsed}>{label}</Label>
    </StyledLink>
  );
}

const StyledLink = styled(Link)<{ $active: boolean; $collapsed: boolean }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
  width: ${(p) => (p.$collapsed ? "50px" : "100%")};
  height: 50px;
  padding: 8px 16px;
  border-radius: 9999px;
  justify-content: ${(p) => (p.$collapsed ? "center" : "flex-start")};
  background: ${(p) =>
    p.$active ? "linear-gradient(269.39deg, #175FE2 3.66%, #1045A8 97.9%)" : "#ffffff"};
  color: ${(p) => (p.$active ? "#ffffff" : "#667A6C")};
  transition:
    background-color 0.15s,
    color 0.15s;
`;

const Label = styled.span<{ $collapsed: boolean }>`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${(p) =>
    p.$collapsed &&
    `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `}
`;
