"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import styled from "styled-components";
import { useNotifications } from "@/hooks/use-notifications";
import { formatNotificationTime } from "@/lib/notification-time";
import { stripHtml } from "@/lib/api/adapters/notification-adapter";
import { BellNotificationIcon } from "@/components/shared/DashboardIcons";
import { DataState } from "@/components/shared/DataState";
import { media } from "@/lib/breakpoints";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NotificationButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError, error } = useNotifications();
  const items = data ?? [];
  const hasUnread = items.some((item) => !item.sudahDibaca);

  function handleItemClick(id: string) {
    setOpen(false);
    router.push(`/notification/${encodeURIComponent(id)}`);
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <IconButton type="button" aria-label="Notifikasi">
          <Bell size={20} color="#1D2520" strokeWidth={1.5} />
          {hasUnread && <Badge />}
        </IconButton>
      </DropdownMenuTrigger>
      <Content align="end">
        <Header>Notifikasi</Header>
        <List>
          <DataState
            isLoading={isLoading}
            isError={isError}
            error={error}
            isEmpty={items.length === 0}
            emptyMessage="Tidak ada notifikasi."
          >
            {items.map((item) => {
              const previewMessage = stripHtml(item.pesan);
              return (
                <Item
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  aria-label={`Buka notifikasi ${item.judul}`}
                >
                  <IconWrap>
                    <BellNotificationIcon size={24} />
                  </IconWrap>
                  <ItemBody>
                    <ItemTitle>{item.judul}</ItemTitle>
                    {previewMessage && <ItemMessage>{previewMessage}</ItemMessage>}
                    <ItemTime>{formatNotificationTime(item.dibuatPada)}</ItemTime>
                  </ItemBody>
                  <Dot $visible={!item.sudahDibaca} />
                </Item>
              );
            })}
          </DataState>
        </List>
      </Content>
    </DropdownMenu>
  );
}

const IconButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 9999px;
  background: #ffffff;
  cursor: pointer;

  ${media.desktop} {
    width: 40px;
    height: 40px;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 6px;
  right: 8px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #ee443f;
`;

const Content = styled(DropdownMenuContent)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 350px;
  max-height: 524px;
  padding: 0 0 16px;
  background: #ffffff;
  border: none;
  border-radius: 16px;
  box-shadow: 0px 4px 26px rgba(0, 0, 0, 0.25);
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 52px;
  padding: 16px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #455249;
  border-bottom: 1px solid #ecefed;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Item = styled.button`
  display: flex;
  align-items: flex-start;
  width: 100%;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background: #f6f8f7;
  }

  & + & {
    border-top: 1px solid #f0f3f1;
  }
`;

const IconWrap = styled.div`
  flex-shrink: 0;
  margin-top: 2px;
`;

const ItemBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 4px;
`;

const ItemTitle = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #1d2520;
`;

const ItemMessage = styled.p`
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  color: #455249;
`;

const ItemTime = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #8b9c90;
`;

const Dot = styled.span<{ $visible: boolean }>`
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  margin-top: 6px;
  border-radius: 50%;
  background: #175fe2;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
`;
