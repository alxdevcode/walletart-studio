import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, ZoomIn, ZoomOut, RotateCcw, Check, Move } from "lucide-react";
import { Page } from "@/components/AppShell";
import { CARD_RATIO, CardPreview } from "@/components/CardPreview";
import { clampCrop, fileToSource, geometry, loadImage, renderCrop, type Crop } from "@/lib/crop";
import { saveDesign, useAppState } from "@/lib/store";

export const Route = createFileRoute("/editor")({
  validateSearch: (s: Record<string, unknown>): { id?: string } => (typeof s["id"] === "string" ? { id: s["id"] } : {}),
  head: () => ({
    meta: [
      { title: "Editor — WalletArt" },
      { name: "description", content: "Carica un'immagine e ritagliala nelle proporzioni di una carta." },
      { property: "og:title", content: "Editor — WalletArt" },
      { property: "og:description", content: "Ritaglia, ingrandisci e posiziona la tua grafica." },
    ],
  }),
  component: Editor,
});

const START: Crop = { zoom: 1, offsetX: 0, offsetY: 0 };

function Editor() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const { designs } = useAppState();
  const existing = designs.find((d) => d.id === id);

  const [source, setSource] = useState<string | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>(START);
  const [name, setName] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(340);
  const drag = useRef<{ x: number; y: number; c: Crop } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existing && !source) {
      setSource(existing.source);
      setCrop({ zoom: existing.zoom, offsetX: existing.offsetX, offsetY: existing.offsetY });
      setName(existing.name);
    }
  }, [existing, source]);

  useEffect(() => { if (source) loadImage(source).then(setImg); }, [source]);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Live preview render, throttled per frame
  useEffect(() => {
    if (!img) return;
    const r = requestAnimationFrame(() => setPreview(renderCrop(img, crop, 428)));
    return () => cancelAnimationFrame(r);
  }, [img, crop]);

  const update = (c: Crop) => img && setCrop(clampCrop(img.width, img.height, c));

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setSource(await fileToSource(f));
    setCrop(START);
    if (!name) setName(f.name.replace(/\.[^.]+$/, "").slice(0, 32));
    e.target.value = "";
  }

  function save() {
    if (!img || !source) return;
    const designId = existing?.id ?? crypto.randomUUID();
    saveDesign({ id: designId, name: name.trim() || "Senza titolo", source, rendered: renderCrop(img, crop), ...crop });
    navigate({ to: "/cards" });
  }

  const g = img ? geometry(img.width, img.height, width, crop) : null;

  return (
    <Page title={existing ? "Modifica grafica" : "Nuova grafica"} subtitle="Editor">
      <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={onFile} />

      <div
        ref={frame}
        className="relative w-full touch-none select-none overflow-hidden rounded-2xl border bg-muted"
        style={{ aspectRatio: CARD_RATIO }}
        onPointerDown={(e) => { if (!img) return; (e.target as Element).setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, c: crop }; }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          update({ ...d.c, offsetX: d.c.offsetX + (e.clientX - d.x) / width, offsetY: d.c.offsetY + (e.clientY - d.y) / width });
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        {img && g ? (
          <>
            <img
              src={source!}
              alt=""
              draggable={false}
              className="pointer-events-none absolute max-w-none"
              style={{ width: g.dw, height: g.dh, left: (width - g.dw) / 2 + crop.offsetX * width, top: (g.H - g.dh) / 2 + crop.offsetY * width }}
            />
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-inset ring-primary/70" />
            <div className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-glass px-2 py-1 text-[10px] font-semibold">
              <Move className="h-3 w-3" /> Trascina
            </div>
          </>
        ) : (
          <button onClick={() => fileInput.current?.click()} className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground transition hover:text-foreground">
            <ImagePlus className="h-8 w-8 text-primary" />
            <span className="text-sm font-semibold">Scegli dalla galleria</span>
            <span className="text-xs">Formato carta 85,6 × 54 mm</span>
          </button>
        )}
      </div>

      {img && (
        <div className="mt-5 space-y-5">
          <div className="flex items-center gap-3">
            <button aria-label="Riduci" onClick={() => update({ ...crop, zoom: Math.max(1, crop.zoom - 0.2) })} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><ZoomOut className="h-4 w-4" /></button>
            <input
              type="range" min={1} max={4} step={0.01} value={crop.zoom} aria-label="Zoom"
              onChange={(e) => update({ ...crop, zoom: Number(e.target.value) })}
              className="h-1 flex-1 cursor-pointer accent-primary"
            />
            <button aria-label="Ingrandisci" onClick={() => update({ ...crop, zoom: Math.min(4, crop.zoom + 0.2) })} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><ZoomIn className="h-4 w-4" /></button>
            <button aria-label="Reimposta" onClick={() => setCrop(START)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><RotateCcw className="h-4 w-4" /></button>
          </div>

          <label className="block">
            <span className="mb-1.5 block px-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Nome</span>
            <input value={name} maxLength={32} onChange={(e) => setName(e.target.value)} placeholder="Es. Tramonto" className="w-full rounded-xl border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </label>

          <div>
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Anteprima in tempo reale</p>
            <div className="mx-auto w-3/4"><CardPreview src={preview} /></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => fileInput.current?.click()} className="flex items-center justify-center gap-2 rounded-xl border bg-card py-3.5 text-sm font-semibold active:scale-[0.98]">
              <ImagePlus className="h-4 w-4" /> Cambia
            </button>
            <button onClick={save} className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:scale-[0.98]">
              <Check className="h-4 w-4" /> Salva
            </button>
          </div>
        </div>
      )}
    </Page>
  );
}
