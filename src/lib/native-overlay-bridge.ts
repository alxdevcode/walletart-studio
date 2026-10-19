import { Capacitor, registerPlugin } from "@capacitor/core";

/**
 * Collegamento tra l'interfaccia React
 * e il futuro plugin Android NativeOverlay.
 */

export type PermissionState =
  | "granted"
  | "denied"
  | "unavailable";

export interface OverlayConfig {
  imageDataUrl: string;
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
  checkPermission(): Promise<{
    state: PermissionState;
  }>;
  requestPermission(): Promise<{
    state: PermissionState;
  }>;
  configure(config: OverlayConfig): Promise<void>;
  show(): Promise<void>;
  hide(): Promise<void>;
  isVisible(): Promise<{
    visible: boolean;
  }>;
}>;

const nativePlugin =
  registerPlugin<CapacitorPlugin>("NativeOverlay");

function getPlugin(): CapacitorPlugin | null {
  return Capacitor.isNativePlatform()
    ? nativePlugin
    : null;
}

let webVisible = false;

export const overlayBridge: NativeOverlayBridge = {
  isNativeAvailable() {
    return !!getPlugin();
  },

  async checkPermission() {
    const plugin = getPlugin();

    return plugin?.checkPermission
      ? (await plugin.checkPermission()).state
      : "unavailable";
  },

  async requestPermission() {
    const plugin = getPlugin();

    return plugin?.requestPermission
      ? (await plugin.requestPermission()).state
      : "unavailable";
  },

  async configure(config) {
    const plugin = getPlugin();

    if (!plugin?.configure) {
      throw new Error(
        "Plugin Android NativeOverlay non disponibile"
      );
    }

    await plugin.configure(config);
  },

  async show() {
    const plugin = getPlugin();

    if (!plugin?.show) {
      throw new Error(
        "Plugin Android NativeOverlay non disponibile"
      );
    }

    await plugin.show();
    webVisible = true;
  },

  async hide() {
    const plugin = getPlugin();

    if (plugin?.hide) {
      await plugin.hide();
    }

    webVisible = false;
  },

  async isVisible() {
    const plugin = getPlugin();

    return plugin?.isVisible
      ? (await plugin.isVisible()).visible
      : webVisible;
  },
};
