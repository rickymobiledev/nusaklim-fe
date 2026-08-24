"use client";

import { usePathname } from "next/navigation";
import styled from "styled-components";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { NAV_ITEMS } from "@/constants";
import { useSidebarStore } from "@/hooks/use-sidebar-store";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SidebarItem } from "./SidebarItem";

const Aside = styled.aside<{ $collapsed: boolean }>`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid var(--border);
  background: var(--card);
  padding: ${(p) => p.theme.spacing.md} 0;
  width: ${(p) => (p.$collapsed ? "4rem" : "14rem")};
  transition: width 0.2s;
`;

const NavAction = styled.button<{ $collapsed: boolean }>`
  display: flex;
  height: 2.75rem;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  padding: 0 ${(p) => (p.$collapsed ? "0" : p.theme.spacing.md)};
  justify-content: ${(p) => (p.$collapsed ? "center" : "flex-start")};
  border-radius: ${(p) => p.theme.radius.md};
  color: ${(p) => p.theme.colors.neutral[500]};
  transition:
    background-color 0.15s,
    color 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.neutral[100]};
    color: ${(p) => p.theme.colors.neutral[900]};
  }

  &.destructive:hover {
    background: ${(p) => p.theme.colors.danger[50]};
    color: ${(p) => p.theme.colors.danger[700]};
  }
`;

const ActionLabel = styled.span<{ $collapsed: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;

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

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebarStore();
  const { user } = useCurrentUser();
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user?.role && item.roles.includes(user.role)),
  );

  return (
    <Aside $collapsed={collapsed}>
      <div className="flex flex-col gap-2">
        <nav className="flex flex-col gap-1 px-3">
          {visibleItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-1 px-3">
        <NavAction
          onClick={toggle}
          title={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
          $collapsed={collapsed}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 shrink-0" />
          ) : (
            <ChevronLeft className="h-5 w-5 shrink-0" />
          )}
          <ActionLabel $collapsed={collapsed}>Ciutkan</ActionLabel>
        </NavAction>

        <NavAction
          className="destructive"
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Keluar"
          $collapsed={collapsed}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <ActionLabel $collapsed={collapsed}>Keluar</ActionLabel>
        </NavAction>
      </div>
    </Aside>
  );
}
