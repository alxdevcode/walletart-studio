// Capacitor config for the Android build. Install with:
//   bun add @capacitor/core @capacitor/cli @capacitor/android && bunx cap add android
// The native "NativeOverlay" plugin (see src/lib/native-overlay-bridge.ts) is developed separately.
const config = {
  appId: "app.walletart",
  appName: "WalletArt",
  webDir: "dist/client",
  android: { backgroundColor: "#1c1d22" },
};

export default config;
