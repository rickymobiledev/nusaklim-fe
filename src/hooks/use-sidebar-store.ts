import { create } from "zustand";

interface SidebarState {
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
}

/** State UI ringan, client-only — tidak perlu ikut React Query/server state.
 *  Cuma relevan di viewport <1280px: di desktop Sidebar drawer disembunyikan
 *  total lewat CSS (lihat `Sidebar.tsx`), jadi state ini tidak berdampak
 *  visual sama sekali di sana. */
export const useSidebarStore = create<SidebarState>((set) => ({
  mobileOpen: false,
  openMobile: () => set({ mobileOpen: true }),
  closeMobile: () => set({ mobileOpen: false }),
  toggleMobile: () => set((state) => ({ mobileOpen: !state.mobileOpen })),
}));
