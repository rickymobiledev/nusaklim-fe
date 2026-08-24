"use client";

import type { ReactNode } from "react";
import type { UserRole } from "@/types/auth";
import { useCurrentUser } from "@/hooks/use-current-user";

export function RoleGate({
  allow,
  children,
  fallback = null,
}: {
  allow: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { user } = useCurrentUser();

  if (!user?.role || !allow.includes(user.role)) return <>{fallback}</>;

  return <>{children}</>;
}
