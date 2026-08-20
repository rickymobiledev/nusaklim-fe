import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { WeatherMetricRange } from "@/types/domain";

function fmt(value: number | null, satuan: string) {
  return value === null ? "--" : `${value} ${satuan}`;
}

export function WeatherMetricCard({
  icon: Icon,
  label,
  data,
}: {
  icon: LucideIcon;
  label: string;
  data: WeatherMetricRange;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold tabular-data">
            {fmt(data.nilai, data.satuan)}
          </p>
          <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
            <span>
              Min <span className="tabular-data">{fmt(data.min, data.satuan)}</span>
            </span>
            <span>
              Maks <span className="tabular-data">{fmt(data.maks, data.satuan)}</span>
            </span>
          </div>
        </div>
        <Icon className="h-10 w-10 text-primary/40" />
      </CardContent>
    </Card>
  );
}
