import { useSyncExternalStore } from "react";

export interface Design {
  id: string;
  name: string;
  /** Downscaled original image, kept so the crop can be edited later. */
  source: string;
  /** Final cropped render. */
  rendered: string;
  zoom: number;
  offsetX: number;
  offsetY: number;
  updatedAt: number;
}

export interface AppState {
  designs: Design[];
  activeId: string | null;
  overlayEnabled: boolean;
  theme: "dark" | "light";
}

const KEY = "walletart:v1";
const initial: AppState = { designs: [], activeId: null, overlayEnabled: false, theme: "dark" };
let state: AppState = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch { /* ignore */ }
}

export function setState(patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) {
  load();
  state = { ...state, ...(typeof patch === "function" ? patch(state) : patch) };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* quota */ }
  listeners.forEach((l) => l());
}

export function useAppState(): AppState {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => { load(); return state; },
    () => initial,
  );
}

export function saveDesign(d: Omit<Design, "updatedAt">) {
  setState((s) => {
    const next = { ...d, updatedAt: Date.now() };
    const exists = s.designs.some((x) => x.id === d.id);
    return {
      designs: exists ? s.designs.map((x) => (x.id === d.id ? next : x)) : [next, ...s.designs],
      activeId: s.activeId ?? d.id,
    };
  });
}

export function deleteDesign(id: string) {
  setState((s) => {
    const designs = s.designs.filter((d) => d.id !== id);
    return { designs, activeId: s.activeId === id ? designs[0]?.id ?? null : s.activeId };
  });
}
