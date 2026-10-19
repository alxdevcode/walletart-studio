import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.walletart",
  appName: "WalletArt",
  webDir: ".output/public",

  android: {
    backgroundColor: "#1c1d22",
    allowMixedContent: false,
  },
};

export default config;
