import type { ReactNode } from "react";
import { Logo } from "@/components/shared/Logo";
import { AuthFooter } from "@/components/domain/auth/AuthCopy";
import { AuthHeroPanel } from "@/components/layout/AuthHeroPanel";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex w-full flex-col gap-2.5 p-10 lg:w-[640px]">
        <Logo />

        <div className="flex flex-1 items-center justify-center py-16 lg:px-16">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>

        <AuthFooter />
      </div>

      <div className="hidden flex-1 p-6 lg:block">
        <AuthHeroPanel
          imageSrc="/images/auth-hero.png"
          headline="Pantau data iklim terpadu dan akurat untuk tanaman kelapa sawit"
        />
      </div>
    </div>
  );
}
