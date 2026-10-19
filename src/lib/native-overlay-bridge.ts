/**
 * NativeOverlayBridge — contract between the web UI and the Android overlay.
 * The native implementation (Capacitor plugin "NativeOverlay") is developed separately.
 * On the web, a local fallback only tracks UI state: nothing is drawn over other apps.
 */
export type PermissionState = "granted" | "denied" | "unavailable";

export interface OverlayConfig {
  /** PNG/JPEG data URL of the cropped artwork (bank-card ratio 85.6:53.98). */
  imageDataUrl: string;
  /** 0–1 */
  opacity: number;
  cornerRadius: number;
}

export interface NativeOverlayBridge {
  isNativeAvailable(): boolean;
  checkPermission(): Promise<PermissionState>;
  requestPermission(): Promise<PermissionState>;
  configure(config: OverlayConfig): Promise<void>;
  show(): Promise<void>;
  hide(): Promise<void>;
  isVisible(): Promise<boolean>;
}

type CapacitorPlugin = Partial<{
  checkPermission(): Promise<{ state: PermissionState }>;
  requestPermission(): Promise<{ state: PermissionState }>;
  configure(c: OverlayConfig): Promise<void>;
  show(): Promise<void>;
  hide(): Promise<void>;
  isVisible(): Promise<{ visible: boolean }>;
}>;

function getPlugin(): CapacitorPlugin | null {
  if (typeof window === "undefined") return null;
  const cap = (window as unknown as { Capacitor?: { Plugins?: Record<string, CapacitorPlugin> } }).Capacitor;
  return cap?.Plugins?.NativeOverlay ?? null;
}

let webVisible = false;

export const overlayBridge: NativeOverlayBridge = {
  isNativeAvailable: () => !!getPlugin(),
  async checkPermission() {
    const p = getPlugin();
    return p?.checkPermission ? (await p.checkPermission()).state : "unavailable";
  },
  async requestPermission() {
    const p = getPlugin();
    return p?.requestPermission ? (await p.requestPermission()).state : "unavailable";
  },
  async configure(config) {
    await getPlugin()?.configure?.(config);
  },
  async show() {
    const p = getPlugin();
    if (p?.show) await p.show();
    webVisible = true;
  },
  async hide() {
    const p = getPlugin();
    if (p?.hide) await p.hide();
    webVisible = false;
  },
  async isVisible() {
    const p = getPlugin();
    return p?.isVisible ? (await p.isVisible()).visible : webVisible;
  },
};
