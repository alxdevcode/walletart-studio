import { useCallback, useEffect, useState } from "react";
import { overlayBridge, type PermissionState } from "@/lib/native-overlay-bridge";

export function useOverlayPermission() {
  const [state, setState] = useState<PermissionState | "loading">("loading");
  useEffect(() => { overlayBridge.checkPermission().then(setState); }, []);
  const request = useCallback(async () => setState(await overlayBridge.requestPermission()), []);
  return { state, request };
}
