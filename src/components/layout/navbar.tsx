"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { getPageTitle } from "@/lib/constants";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div>
        <p className="text-xs text-muted-foreground">Home / {title}</p>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium leading-tight">
            {session?.user?.name ?? "Guest"}
          </p>
          <p className="text-xs text-muted-foreground leading-tight">
            {session?.user?.email ?? ""}
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {(session?.user?.name ?? "G").charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
