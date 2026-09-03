"use client";

import styled from "styled-components";

/** Placeholder untuk 3 tab Peta yang belum ada data-nya (endpoint
 *  `water_deficit`/`dry_spell`/`rainfall_today` belum diimplementasi sama
 *  sekali di layer manapun — lihat docs/ARCHITECTURE.md bagian 2 & TODO).
 *  Jangan bikin hook/route/type kosong cuma buat "isi" tab ini. */
export function ComingSoonCard({ label }: { label: string }) {
  return (
    <Card>
      <Title>{label}</Title>
      <Text>Fitur ini akan segera hadir.</Text>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 400px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 20px;
  text-align: center;
`;

const Title = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1d2520;
`;

const Text = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 14px;
  color: #8b9c90;
`;
