"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getBreadcrumbTrail } from "@/constants";
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/** `currentLabel` (opsional) menggantikan label crumb TERAKHIR — dipakai
 *  halaman dengan judul dinamis (mis. detail berita). */
export function Breadcrumb({ currentLabel }: { currentLabel?: string }) {
  const pathname = usePathname();
  const trail = getBreadcrumbTrail(pathname).map((crumb, index, all) =>
    currentLabel && index === all.length - 1 ? { ...crumb, label: currentLabel } : crumb,
  );

  return (
    <div className="py-3">
      <BreadcrumbRoot>
        <BreadcrumbList className="gap-2 sm:gap-2">
          {trail.map((crumb, index) => {
            const isLast = index === trail.length - 1;
            return (
              <Fragment key={crumb.href}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="font-body text-primary text-xs font-semibold">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      asChild
                      className="font-body hover:text-primary text-xs font-semibold text-[#8B9C90]"
                    >
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator>
                    <ChevronRight
                      size={16}
                      strokeWidth={1.5}
                      className="text-[#8B9C90]"
                    />
                  </BreadcrumbSeparator>
                )}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </BreadcrumbRoot>
    </div>
  );
}
