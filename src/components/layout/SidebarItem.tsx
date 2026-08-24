"use client";

import Link from "next/link";
import styled from "styled-components";
import type { LucideIcon } from "lucide-react";

const StyledLink = styled(Link)<{ $active: boolean; $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  height: calc(${(p) => p.theme.spacing.xl} + ${(p) => p.theme.spacing.md});
  padding: 0 ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radius.md};
  justify-content: ${(p) => (p.$collapsed ? "center" : "flex-start")};
  background: ${(p) => (p.$active ? p.theme.colors.primary[600] : "transparent")};
  color: ${(p) => (p.$active ? p.theme.colors.primary[50] : p.theme.colors.neutral[500])};
  transition:
    background-color 0.15s,
    color 0.15s;

  &:hover {
    background: ${(p) => (p.$active ? p.theme.colors.primary[600] : p.theme.colors.neutral[100])};
    color: ${(p) => (p.$active ? p.theme.colors.primary[50] : p.theme.colors.neutral[900])};
  }
`;

const Label = styled.span<{ $collapsed: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
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

export function SidebarItem({
  href,
  icon: Icon,
  label,
  active,
  collapsed,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <StyledLink href={href} title={label} $active={active} $collapsed={collapsed}>
      <Icon size={20} className="shrink-0" />
      <Label $collapsed={collapsed}>{label}</Label>
    </StyledLink>
  );
}
