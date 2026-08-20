import Link from "next/link";
import { Scale, TreeDeciduous, CloudSun, Sun } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const items = [
  {
    href: "/monitoring/keseimbangan-air",
    title: "Keseimbangan Air",
    desc: "Periksa semua laporan analisis keseimbangan air",
    icon: Scale,
  },
  {
    href: "/monitoring/deret-hari-tidak-hujan",
    title: "Deret Terpanjang Hari Tidak Hujan",
    desc: "Periksa laporan tentang deret terpanjang hari tidak hujan",
    icon: TreeDeciduous,
  },
  {
    href: "/monitoring/lama-penyinaran",
    title: "Lama Penyinaran",
    desc: "Periksa laporan dari lama penyinaran",
    icon: CloudSun,
  },
  {
    href: "/monitoring/vpd",
    title: "VPD",
    desc: "Periksa indeks cekaman kekeringan pada tanaman",
    icon: Sun,
  },
];

export default function MonitoringPage() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="flex gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
