import type { ReactNode } from "react";
import { Logo } from "@/components/shared/Logo";
import { AuthFooter } from "@/components/domain/auth/AuthCopy";
import { AuthHeroCard } from "@/components/layout/AuthHeroCard";
import { AuthHeroPanel } from "@/components/layout/AuthHeroPanel";

const HERO_HEADLINE = "Pantau data iklim terpadu dan akurat untuk tanaman kelapa sawit";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F5F7FB] lg:bg-white">
      <div className="flex w-full flex-col gap-6 px-4 py-10 lg:w-[640px] lg:gap-2.5 lg:p-10">
        <Logo />

        <div className="flex flex-1 flex-col lg:items-center lg:justify-center lg:px-16 lg:py-16">
          <div className="mx-auto flex w-full max-w-[400px] flex-col gap-6 lg:mx-0">
            <div className="lg:hidden">
              <AuthHeroCard
                imageSrc="/images/auth-hero-mobile.webp"
                headline={HERO_HEADLINE}
              />
            </div>
            {children}
          </div>
        </div>

        <AuthFooter />
      </div>

      <div className="hidden flex-1 p-6 lg:block">
        <AuthHeroPanel imageSrc="/images/auth-hero.png" headline={HERO_HEADLINE} />
      </div>
    </div>
  );
}
