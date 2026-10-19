import { CARD_RATIO } from "@/components/CardPreview";

export interface Crop { zoom: number; offsetX: number; offsetY: number }

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

/** Downscale a picked file so it fits in local storage. */
export async function fileToSource(file: File, max = 1600): Promise<string> {
  const url = URL.createObjectURL(file);
  const img = await loadImage(url);
  const s = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement("canvas");
  c.width = Math.round(img.width * s);
  c.height = Math.round(img.height * s);
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  URL.revokeObjectURL(url);
  return c.toDataURL("image/jpeg", 0.88);
}

/** Geometry for a frame of width W. Offsets are fractions of W from center. */
export function geometry(iw: number, ih: number, W: number, crop: Crop) {
  const H = W / CARD_RATIO;
  const scale = Math.max(W / iw, H / ih) * crop.zoom;
  const dw = iw * scale, dh = ih * scale;
  const maxX = (dw - W) / 2 / W, maxY = (dh - H) / 2 / W;
  return { H, dw, dh, maxX, maxY };
}

export function clampCrop(iw: number, ih: number, crop: Crop): Crop {
  const { maxX, maxY } = geometry(iw, ih, 1, crop);
  return { ...crop, offsetX: Math.max(-maxX, Math.min(maxX, crop.offsetX)), offsetY: Math.max(-maxY, Math.min(maxY, crop.offsetY)) };
}

export function renderCrop(img: HTMLImageElement, crop: Crop, W = 1012): string {
  const { H, dw, dh } = geometry(img.width, img.height, W, crop);
  const c = document.createElement("canvas");
  c.width = W;
  c.height = Math.round(H);
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, (W - dw) / 2 + crop.offsetX * W, (H - dh) / 2 + crop.offsetY * W, dw, dh);
  return c.toDataURL("image/jpeg", 0.9);
}
