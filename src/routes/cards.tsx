import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, Layers } from "lucide-react";
import { Page } from "@/components/AppShell";
import { CardPreview } from "@/components/CardPreview";
import { deleteDesign, setState, useAppState } from "@/lib/store";

export const Route = createFileRoute("/cards")({
  head: () => ({
    meta: [
      { title: "Le mie carte — WalletArt" },
      { name: "description", content: "La raccolta delle grafiche salvate sul dispositivo." },
      { property: "og:title", content: "Le mie carte — WalletArt" },
      { property: "og:description", content: "Gestisci, modifica ed elimina le tue grafiche." },
    ],
  }),
  component: Cards,
});

function Cards() {
  const { designs, activeId } = useAppState();
  const [confirm, setConfirm] = useState<string | null>(null);

  return (
    <Page
      title="Le mie carte"
      subtitle={`${designs.length} grafich${designs.length === 1 ? "a" : "e"}`}
      action={
        <Link to="/editor" aria-label="Aggiungi" className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition active:scale-95">
          <Plus className="h-5 w-5" />
        </Link>
      }
    >
      {designs.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed px-6 py-14 text-center">
          <Layers className="mb-3 h-8 w-8 text-primary" />
          <p className="font-semibold">Ancora nessuna grafica</p>
          <p className="mt-1 text-sm text-muted-foreground">Carica un'immagine per creare la tua prima carta.</p>
          <Link to="/editor" className="mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Crea grafica</Link>
        </div>
      ) : (
        <ul className="space-y-5">
          {designs.map((d) => {
            const active = d.id === activeId;
            return (
              <li key={d.id} className="rounded-2xl border bg-card p-3 animate-rise">
                <button onClick={() => setState({ activeId: d.id })} className="block w-full text-left" aria-label={`Usa ${d.name}`}>
                  <CardPreview src={d.rendered} label={d.name} className={active ? "ring-2 ring-primary" : ""} />
                </button>
                <div className="mt-3 flex items-center gap-2 px-1">
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate font-semibold">
                      {d.name} {active && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(d.updatedAt).toLocaleDateString("it-IT")}</p>
                  </div>
                  {confirm === d.id ? (
                    <>
                      <button onClick={() => setConfirm(null)} className="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground">Annulla</button>
                      <button onClick={() => { deleteDesign(d.id); setConfirm(null); }} className="rounded-lg bg-destructive px-3 py-2 text-xs font-semibold text-destructive-foreground">Elimina</button>
                    </>
                  ) : (
                    <>
                      <Link to="/editor" search={{ id: d.id }} aria-label="Modifica" className="rounded-lg p-2.5 text-muted-foreground hover:bg-muted"><Pencil className="h-4 w-4" /></Link>
                      <button onClick={() => setConfirm(d.id)} aria-label="Elimina" className="rounded-lg p-2.5 text-muted-foreground hover:bg-muted hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Page>
  );
}
