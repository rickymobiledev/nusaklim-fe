"use client";

import { usePathname } from "next/navigation";
import styled from "styled-components";
import { NAV_ITEMS } from "@/constants";
import { useSidebarStore } from "@/hooks/use-sidebar-store";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SidebarToggleIcon } from "@/components/shared/SidebarIcons";
import { SidebarItem } from "./SidebarItem";

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebarStore();
  const { user } = useCurrentUser();
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user?.role && item.roles.includes(user.role)),
  );

  return (
    <Aside $collapsed={collapsed}>
      <NavList>
        <ToggleButton
          onClick={toggle}
          title={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
        >
          <SidebarToggleIcon collapsed={collapsed} />
        </ToggleButton>

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
      </NavList>
    </Aside>
  );
}

const Aside = styled.aside<{ $collapsed: boolean }>`
  display: flex;
  height: 100%;
  flex-direction: column;
  border-right: 1px solid #bbd3ff;
  padding: 16px 0 24px;
  width: ${(p) => (p.$collapsed ? "99px" : "256px")};
  transition: width 0.2s;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 0 24px;
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 9999px;
  background: transparent;
  cursor: pointer;
`;
