"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { ChevronDown } from "lucide-react";
import { media } from "@/lib/breakpoints";

/** Teks/icon sama persis `app/(dashboard)/monitoring/page.tsx` (landing
 *  grid 4 domain Monitoring) — nav pill ini versi ringkas yang dirender
 *  DI ATAS konten tiap halaman domain (bukan pengganti landing grid),
 *  supaya user bisa pindah antar domain tanpa balik ke `/monitoring`
 *  dulu, sesuai referensi Figma. Icon PNG asli Figma (bukan lucide lagi
 *  seperti Fase 2), pola sama `AirPressureTitle.tsx` — file-nya di
 *  `public/brand/<slug>.png`, ditaruh user sendiri, tidak perlu ubah
 *  kode ini lagi begitu file-nya ada/diganti. */
const ITEMS = [
  {
    href: "/monitoring/water-balance",
    title: "Keseimbangan Air",
    desc: "Periksa semua laporan analisis keseimbangan air",
    icon: "/brand/water-balance.png",
  },
  {
    href: "/monitoring/dry-spell",
    title: "Deret Terpanjang Hari Tidak Hujan",
    desc: "Periksa laporan tentang deret terpanjang hari tidak hujan",
    icon: "/brand/dry-spell.png",
  },
  {
    href: "/monitoring/lama-penyinaran",
    title: "Lama Penyinaran",
    desc: "Periksa laporan dari lama penyinaran",
    icon: "/brand/lama-penyinaran.png",
  },
  {
    href: "/monitoring/vpd",
    title: "VPD",
    desc: "Periksa indeks cekaman kekeringan pada tanaman",
    icon: "/brand/vpd.png",
  },
] as const;

export function MonitoringDomainNav() {
  const pathname = usePathname();
  const [brokenIcons, setBrokenIcons] = useState<string[]>([]);

  return (
    <Row>
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <NavCard key={item.href} href={item.href} $active={active}>
            <NavRow>
              {!brokenIcons.includes(item.icon) && (
                <Image
                  src={item.icon}
                  alt=""
                  width={50}
                  height={50}
                  onError={() => setBrokenIcons((prev) => [...prev, item.icon])}
                />
              )}
              <NavTitle $active={active}>{item.title}</NavTitle>
              <ChevronDown size={18} color={active ? "#ffffff" : "#1d2520"} />
            </NavRow>
            <NavDesc $active={active}>{item.desc}</NavDesc>
          </NavCard>
        );
      })}
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  ${media.desktop} {
    overflow-x: visible;
  }
`;

const NavCard = styled(Link)<{ $active: boolean }>`
  box-sizing: border-box;
  flex: 0 0 336px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: ${(p) => (p.$active ? "#175fe2" : "rgba(255, 255, 255, 0.7)")};
  border: 1px solid ${(p) => (p.$active ? "#1045a8" : "#d6dcd8")};
  border-radius: 12px;
  text-decoration: none;

  ${media.desktop} {
    flex: 1 1 0;
    min-width: 0;
  }
`;

const NavRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavTitle = styled.p<{ $active: boolean }>`
  flex: 1;
  margin: 0;
  font-family: var(--font-body), sans-serif;
  font-size: 18px;
  line-height: 28px;
  font-weight: 700;
  color: ${(p) => (p.$active ? "#ffffff" : "#1d2520")};
`;

const NavDesc = styled.p<{ $active: boolean }>`
  margin: 0;
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: ${(p) => (p.$active ? "#ffffff" : "#667a6c")};
`;
