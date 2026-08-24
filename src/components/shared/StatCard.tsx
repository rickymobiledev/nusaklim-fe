import type { LucideIcon } from "lucide-react";
import styled from "styled-components";
import { Card, CardContent } from "@/components/ui/card";
import { toneColor, type Tone } from "@/lib/theme-utils";

const Content = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  text-align: center;
  /* CardContent bawaan pakai "pt-0"; di sini berdiri sendiri tanpa
     CardHeader jadi padding dikembalikan penuh di semua sisi. */
  padding: ${(p) => p.theme.spacing.lg};
`;

const IconBadge = styled.div<{ $tone: Tone }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(${(p) => p.theme.spacing.xl} + ${(p) => p.theme.spacing.xs});
  height: calc(${(p) => p.theme.spacing.xl} + ${(p) => p.theme.spacing.xs});
  border-radius: ${(p) => p.theme.radius.md};
  background: ${(p) => toneColor(p.theme, p.$tone, 100)};
  color: ${(p) => toneColor(p.theme, p.$tone, p.$tone === "default" ? 600 : 700)};
`;

const Label = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.neutral[500]};
`;

const Value = styled.p<{ $tone: Tone }>`
  font-size: 1.875rem;
  font-weight: 700;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  color: ${(p) => (p.$tone === "default" ? "inherit" : toneColor(p.theme, p.$tone, 700))};
`;

export function StatCard({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  tone?: Tone;
}) {
  return (
    <Card className="flex-1">
      <Content>
        <IconBadge $tone={tone}>
          <Icon className="h-5 w-5" />
        </IconBadge>
        <Label>{label}</Label>
        <Value $tone={tone}>{value}</Value>
      </Content>
    </Card>
  );
}
