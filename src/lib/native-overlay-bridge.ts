import {
  Capacitor,
  registerPlugin,
} from "@capacitor/core";

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

interface NativeOverlayPlugin {
  checkPermission(): Promise<{ state: PermissionState }>;
  requestPermission(): Promise<{ state: PermissionState }>;
  configure(config: OverlayConfig): Promise<void>;
  show(): Promise<void>;
  hide(): Promise<void>;
  isVisible(): Promise<{ visible: boolean }>;
}

const plugin =
  registerPlugin<NativeOverlayPlugin>("NativeOverlay");

function available(): boolean {
  return (
    Capacitor.getPlatform() === "android" &&
    Capacitor.isPluginAvailable("NativeOverlay")
  );
}

function requirePlugin(): NativeOverlayPlugin {
  if (!available()) {
    throw new Error(
      "Plugin NativeOverlay non installato nell'APK Android."
    );
  }

  return plugin;
}

export const overlayBridge: NativeOverlayBridge = {
  isNativeAvailable: available,

  async checkPermission() {
    if (!available()) return "unavailable";
    return (await plugin.checkPermission()).state;
  },

  async requestPermission() {
    if (!available()) return "unavailable";
    return (await plugin.requestPermission()).state;
  },

  async configure(config) {
    await requirePlugin().configure(config);
  },

  async show() {
    await requirePlugin().show();
  },

  async hide() {
    await requirePlugin().hide();
  },

  async isVisible() {
    if (!available()) return false;
    return (await plugin.isVisible()).visible;
  },
};
