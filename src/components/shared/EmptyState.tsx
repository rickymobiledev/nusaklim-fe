import type { LucideIcon } from "lucide-react";

/** Placeholder kerangka — belum dipasang di halaman manapun. */
export function EmptyState({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      {Icon && <Icon className="text-muted-foreground h-8 w-8" />}
      <p className="text-foreground text-sm font-medium">{title}</p>
      {description && <p className="text-muted-foreground text-sm">{description}</p>}
    </div>
  );
}
