import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const CARD_RATIO = 85.6 / 53.98;

export function CardPreview({ src, className, label }: { src?: string | null; className?: string; label?: string }) {
  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-2xl bg-card-gradient shadow-card card-sheen", className)}
      style={{ aspectRatio: CARD_RATIO }}
    >
      {src ? (
        <img src={src} alt={label ?? "Grafica carta"} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-primary">
          <Sparkles className="h-6 w-6" />
          <span className="text-xs font-medium tracking-wide text-foreground/70">Nessuna grafica</span>
        </div>
      )}
    </div>
  );
}
