import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api/error-messages";

/** Standarisasi tampilan loading/error/empty untuk komponen yang konsumsi
 *  hook data (TanStack Query). Kalau semua state normal, render `children`. */
export function DataState({
  isLoading,
  isError,
  error,
  isEmpty = false,
  emptyMessage = "Data Tidak Tersedia",
  children,
}: {
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-destructive py-6 text-center text-sm">
        {getErrorMessage(error)}
      </p>
    );
  }

  if (isEmpty) {
    return (
      <p className="text-muted-foreground py-10 text-center text-sm">{emptyMessage}</p>
    );
  }

  return <>{children}</>;
}
