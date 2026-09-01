"use client";

import { ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import styled from "styled-components";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { media } from "@/lib/breakpoints";

export function UserMenu() {
  const { user } = useCurrentUser();
  const name = user?.name ?? "Guest";
  const roleName = user?.roleName ?? "Guest";

  return (
    <DropdownMenu>
      <Trigger>
        <StyledAvatar>
          <AvatarImage src={user?.image ?? undefined} alt={name} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </StyledAvatar>
        <DetailsGroup>
          <TextBlock>
            <Name>{name}</Name>
            <Role>{roleName}</Role>
          </TextBlock>
          <ChevronDown size={16} color="#6D717F" strokeWidth={1.5} />
        </DetailsGroup>
      </Trigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => signOut({ callbackUrl: "/login" })}
        >
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const StyledAvatar = styled(Avatar)`
  width: 36px;
  height: 36px;
`;

const Trigger = styled(DropdownMenuTrigger)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  border: none;
  border-radius: 9999px;
  background: #ffffff;
  cursor: pointer;

  ${media.desktop} {
    padding: 4px 12px 4px 4px;
  }
`;

const DetailsGroup = styled.span`
  display: none;

  ${media.desktop} {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Name = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #1d2520;
`;

const Role = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #8b9c90;
`;
