"use client";

import { Bell } from "lucide-react";
import styled from "styled-components";

export function NotificationButton({ hasUnread = true }: { hasUnread?: boolean }) {
  return (
    <IconButton type="button" aria-label="Notifikasi">
      <Bell size={20} color="#1D2520" strokeWidth={1.5} />
      {hasUnread && <Badge />}
    </IconButton>
  );
}

const IconButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 9999px;
  background: #ffffff;
  cursor: pointer;
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
