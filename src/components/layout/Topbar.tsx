"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { getPageTitle } from "@/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Topbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const name = session?.user?.name ?? "Guest";

  return (
    <header className="border-border bg-card flex h-16 items-center justify-between border-b px-6">
      <h1 className="text-foreground text-lg font-semibold">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium leading-tight">{name}</p>
          <p className="text-muted-foreground text-xs leading-tight">
            {session?.user?.email ?? ""}
          </p>
        </div>
        <Avatar>
          <AvatarImage src={session?.user?.image ?? undefined} alt={name} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
