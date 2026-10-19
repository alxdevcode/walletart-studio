import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Pencil,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
} from "lucide-react";

import {
  Page,
  Section,
  StatusPill,
} from "@/components/AppShell";

import { CardPreview } from "@/components/CardPreview";
import { Switch } from "@/components/Switch";
import { setState, useAppState } from "@/lib/store";
import { overlayBridge } from "@/lib/native-overlay-bridge";
import { useOverlayPermission } from "@/hooks/use-overlay-permission";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "WalletArt — Personalizza le tue carte",
      },
      {
        name: "description",
        content:
          "Anteprima e sovrapposizione della grafica personalizzata delle tue carte digitali.",
      },
      {
        property: "og:title",
        content: "WalletArt — Personalizza le tue carte",
      },
      {
        property: "og:description",
        content:
          "Dai un nuovo stile alle immagini delle tue carte digitali.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { designs, activeId, overlayEnabled } = useAppState();

  const active = designs.find(
    (design) => design.id === activeId
  );

  const { state: perm } = useOverlayPermission();

  const native =
    perm !== "unavailable" && perm !== "loading";

  async function toggle(on: boolean) {
    try {
      if (on) {
        if (!active) return;

        if (!overlayBridge.isNativeAvailable()) {
          window.alert(
            "La sovrapposizione richiede l'app Android nativa."
          );
          return;
        }

        const permission =
          await overlayBridge.checkPermission();

        if (permission !== "granted") {
          await overlayBridge.requestPermission();

          window.alert(
            "Concedi il permesso nelle impostazioni Android e riprova."
          );

          return;
        }

        await overlayBridge.configure({
          imageDataUrl: active.rendered,
          opacity: 1,
          cornerRadius: 16,
        });

        await overlayBridge.show();
      } else {
        await overlayBridge.hide();
      }

      setState({
        overlayEnabled: on,
      });
    } catch (error) {
      setState({
        overlayEnabled: false,
      });

      window.alert(
        error instanceof Error
          ? error.message
          : "Errore sovrapposizione"
      );
    }
  }

  return (
    <Page
      title="La tua carta"
      subtitle="WalletArt"
    >
      <div className="mb-6 [perspective:1000px]">
        <div className="transition-transform duration-500 hover:[transform:rotateX(6deg)_rotateY(-8deg)]">
          <CardPreview
            src={active?.rendered}
            label={active?.name}
          />
        </div>

        <p className="mt-3 text-center text-sm text-muted-foreground">
          {active
            ? active.name
            : "Crea la tua prima grafica"}
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <Link
          to="/editor"
          search={
            active
              ? { id: active.id }
              : {}
          }
          className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition active:scale-[0.98]"
        >
          <Pencil className="h-4 w-4" />

          {active ? "Modifica" : "Crea"}
        </Link>

        <Link
          to="/cards"
          className="flex items-center justify-center gap-2 rounded-xl border bg-card py-3.5 text-sm font-semibold transition active:scale-[0.98]"
        >
          <Layers className="h-4 w-4" />
          Le mie carte
        </Link>
      </div>

      <Section title="Sovrapposizione">
        <div className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Smartphone className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-semibold">
              {overlayEnabled
                ? "Attiva"
                : "Disattivata"}
            </p>

            <p className="text-xs text-muted-foreground">
              {active
                ? "Mostra la grafica sopra la carta"
                : "Salva prima una grafica"}
            </p>
          </div>

          <Switch
            checked={overlayEnabled}
            disabled={!active}
            onChange={toggle}
            label="Sovrapposizione"
          />
        </div>

        <div className="flex items-center justify-between border-t px-4 py-3">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            {perm === "granted" ? (
              <ShieldCheck className="h-4 w-4 text-success" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-warning" />
            )}

            Permesso di sovrapposizione
          </span>

          <StatusPill
            ok={
              native
                ? perm === "granted"
                : null
            }
            okLabel="Concesso"
            koLabel="Mancante"
          />
        </div>
      </Section>

      {!native && (
        <p className="px-1 text-xs leading-relaxed text-muted-foreground">
          Modalità anteprima: la sovrapposizione reale
          funziona solo nell'app Android installata.
        </p>
      )}
    </Page>
  );
}
