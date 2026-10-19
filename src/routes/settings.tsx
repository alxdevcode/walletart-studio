import { createFileRoute } from "@tanstack/react-router";
import { Moon, Sun, Layers2, Image, Info, Lock, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Page, Section, StatusPill } from "@/components/AppShell";
import { setState, useAppState } from "@/lib/store";
import { useOverlayPermission } from "@/hooks/use-overlay-permission";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Impostazioni — WalletArt" },
      { name: "description", content: "Tema, autorizzazioni Android e informazioni su WalletArt." },
      { property: "og:title", content: "Impostazioni — WalletArt" },
      { property: "og:description", content: "Configura tema e autorizzazioni dell'app." },
    ],
  }),
  component: Settings,
});

function Row({ icon, title, desc, right, onClick }: { icon: ReactNode; title: string; desc?: string; right?: ReactNode; onClick?: () => void }) {
  const C = onClick ? "button" : "div";
  return (
    <C onClick={onClick} className="flex w-full items-center gap-3 border-b px-4 py-3.5 text-left last:border-b-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        {desc && <span className="block text-xs text-muted-foreground">{desc}</span>}
      </span>
      {right}
    </C>
  );
}

function Settings() {
  const { theme } = useAppState();
  const { state, request } = useOverlayPermission();
  const native = state !== "unavailable" && state !== "loading";

  return (
    <Page title="Impostazioni" subtitle="WalletArt">
      <Section title="Aspetto">
        <div className="grid grid-cols-2 gap-2 p-2">
          {(["dark", "light"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setState({ theme: t })}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${theme === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              {t === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {t === "dark" ? "Scuro" : "Chiaro"}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Autorizzazioni Android">
        <Row
          icon={<Layers2 className="h-4 w-4" />}
          title="Mostra sopra altre app"
          desc="Necessaria per la sovrapposizione"
          onClick={native && state !== "granted" ? request : undefined}
          right={<span className="flex items-center gap-1"><StatusPill ok={native ? state === "granted" : null} okLabel="Concessa" koLabel="Mancante" />{native && state !== "granted" && <ChevronRight className="h-4 w-4 text-muted-foreground" />}</span>}
        />
        <Row icon={<Image className="h-4 w-4" />} title="Accesso alle foto" desc="Richiesto solo al momento della scelta" right={<StatusPill ok={native ? true : null} okLabel="Su richiesta" koLabel="Mancante" />} />
      </Section>
      {!native && <p className="-mt-3 mb-5 px-1 text-xs text-muted-foreground">Le autorizzazioni sono gestibili nell'app Android installata.</p>}

      <Section title="Informazioni">
        <Row icon={<Lock className="h-4 w-4" />} title="Privacy" desc="Nessun dato bancario. Le grafiche restano sul dispositivo." />
        <Row icon={<Info className="h-4 w-4" />} title="WalletArt" desc="Versione 1.0.0" />
      </Section>
    </Page>
  );
}
