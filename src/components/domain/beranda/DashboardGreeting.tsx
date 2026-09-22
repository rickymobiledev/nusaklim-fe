"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import styled from "styled-components";
import { useCurrentUser } from "@/hooks/use-current-user";

export function DashboardGreeting() {
  const { user } = useCurrentUser();
  const now = new Date();
  const tanggalJam = `${format(now, "EEEE, d MMMM yyyy, HH:mm", { locale: id })} WIB`;

  return (
    <Wrapper>
      <DateTimeText suppressHydrationWarning>{tanggalJam}</DateTimeText>
      <GreetingLine>Selamat {getGreetingByHour(now.getHours())},</GreetingLine>
      <NameLine>{user?.name ?? "Guest"}</NameLine>
    </Wrapper>
  );
}

function getGreetingByHour(hour: number): string {
  if (hour >= 4 && hour < 11) return "Pagi";
  if (hour >= 11 && hour < 15) return "Siang";
  if (hour >= 15 && hour < 18) return "Sore";
  return "Malam";
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

/* Ukuran teks SAMA di semua breakpoint (14px date, 40px/48px greeting) —
 * dikoreksi setelah user kasih CSS Figma mobile persis, yang ternyata
 * pakai ukuran identik desktop (bukan diperkecil), beda dari asumsi
 * awal sebelum ada acuan mobile. */
const DateTimeText = styled.p`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.7);
`;

const GreetingLine = styled.p`
  font-family: var(--font-manrope), sans-serif;
  font-size: 40px;
  font-weight: 700;
  line-height: 48px;
  color: #ffffff;
`;

const NameLine = styled(GreetingLine)``;
