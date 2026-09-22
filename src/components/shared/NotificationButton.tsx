"use client";

import { Bell } from "lucide-react";
import styled from "styled-components";
import { useNotifications } from "@/hooks/use-notifications";
import { formatNotificationTime } from "@/lib/notification-time";
import { BellNotificationIcon } from "@/components/shared/DashboardIcons";
import { DataState } from "@/components/shared/DataState";
import { media } from "@/lib/breakpoints";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Popup Notifikasi — self-contained (fetch sendiri lewat `useNotifications()`,
 *  tidak butuh prop dari `Topbar.tsx`), pola dropdown persis `UserMenu.tsx`.
 *  READ-ONLY: item TIDAK bisa diklik (tidak ada halaman detail per
 *  notifikasi & tidak ada endpoint mark-as-read di scope ini) — lihat
 *  catatan risiko auth di `lib/api/notification-client.ts`. */
export function NotificationButton() {
  const { data, isLoading, isError, error } = useNotifications();
  const items = data ?? [];
  const hasUnread = items.some((item) => !item.sudahDibaca);

  return (
    <DropdownMenu>
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
            {items.map((item) => (
              <Item key={item.id}>
                <BellNotificationIcon size={24} />
                <ItemBody>
                  <ItemTitle>{item.judul}</ItemTitle>
                  <ItemMessage>{item.pesan}</ItemMessage>
                  <ItemTime>{formatNotificationTime(item.dibuatPada)}</ItemTime>
                </ItemBody>
                <Dot $visible={!item.sudahDibaca} />
              </Item>
            ))}
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
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Item = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  gap: 12px;
  padding: 8px 16px;
`;

const ItemBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
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
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #455249;
`;

const ItemTime = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: #8b9c90;
`;

const Dot = styled.span<{ $visible: boolean }>`
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  margin-top: 4px;
  border-radius: 50%;
  background: #175fe2;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
`;
