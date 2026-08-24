import { create } from "zustand";

interface SidebarState {
  collapsed: boolean;
  toggle: () => void;
}

/** State UI ringan, client-only — tidak perlu ikut React Query/server state. */
export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: false,
  toggle: () => set((state) => ({ collapsed: !state.collapsed })),
}));
