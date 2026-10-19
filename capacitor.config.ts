import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.walletart",
  appName: "WalletArt",
  webDir: "dist/client",

  android: {
    backgroundColor: "#1c1d22",
    allowMixedContent: false,
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#1c1d22",
    },
  },
};

export default config;
