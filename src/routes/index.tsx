
import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, Palette, Plus, Check, Pencil } from "lucide-react";
import { useAppState, setState } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wallet Demo — Carta personalizzata" },
    ],
  }),
  component: WalletHome,
});

function WalletHome() {
  const { designs, activeId } = useAppState();

  const active = designs.find(
    (design) => design.id === activeId
  );

  function selectTheme(id: string) {
    setState({ activeId: id });
  }

  return (
    <main
      className="min-h-[100dvh] text-white"
      style={{ backgroundColor: "#1c1d22" }}
    >
      <div className="mx-auto flex min-h-[100dvh] max-w-lg flex-col px-5">
        <header className="flex items-center justify-between pt-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#303238]">
            <CreditCard className="h-7 w-7 text-[#8ab4f8]" />
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#353a48] text-sm font-semibold">
            A
          </div>
        </header>

        <section className="mt-12">
          <div
            className="relative w-full overflow-hidden rounded-[20px] bg-[#35c4ee] shadow-lg"
            style={{ aspectRatio: "1.586" }}
          >
            {active?.rendered ? (
              <img
                src={active.rendered}
                alt="Tema della carta selezionato"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <CreditCard className="h-12 w-12" />
                <span className="text-xl font-bold">
                  Personalizza la carta
                </span>
              </div>
            )}
          </div>

          <p className="mt-5 text-center text-lg font-semibold">
            Alex
          </p>

          <p className="mt-2 text-center text-xs text-white/40">
            Anteprima estetica · Nessun pagamento
          </p>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Palette className="h-5 w-5 text-[#a8c7fa]" />
              Temi carta
            </h2>

            <Link
              to="/editor"
              search={{}}
              className="flex items-center gap-1 text-sm text-[#a8c7fa]"
            >
              <Plus className="h-4 w-4" />
              Nuovo
            </Link>
          </div>

          {designs.length === 0 ? (
            <Link
              to="/editor"
              search={{}}
              className="flex items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-white/70"
            >
              <Plus className="h-5 w-5" />
              Crea il tuo primo tema
            </Link>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-4">
              {designs.map((design) => {
                const selected = design.id === activeId;

                return (
                  <button
                    key={design.id}
                    type="button"
                    onClick={() => selectTheme(design.id)}
                    className="w-36 shrink-0 text-left"
                    aria-label={`Seleziona ${design.name}`}
                    aria-pressed={selected}
                  >
                    <div
                      className={`relative overflow-hidden rounded-xl border-2 ${
                        selected
                          ? "border-[#a8c7fa]"
                          : "border-transparent"
                      }`}
                      style={{ aspectRatio: "1.586" }}
                    >
                      <img
                        src={design.rendered}
                        alt={design.name}
                        className="h-full w-full object-cover"
                      />

                      {selected && (
                        <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#a8c7fa] text-[#1c1d22]">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    <p className="mt-2 truncate text-xs text-white/70">
                      {design.name}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <div className="flex-1" />

        <div className="mb-10 mt-8 flex justify-center">
          <div className="flex items-stretch gap-1">
            <Link
              to="/editor"
              search={active ? { id: active.id } : {}}
              className="flex h-16 items-center justify-center gap-3 rounded-l-full rounded-r-md bg-[#303136] px-8 text-[#b6c8ff]"
            >
              <Pencil className="h-5 w-5" />
              <span className="font-semibold">
                Modifica carta
              </span>
            </Link>

            <Link
              to="/cards"
              className="flex h-16 w-16 items-center justify-center rounded-l-md rounded-r-full bg-[#303136] text-[#b6c8ff]"
              aria-label="Le mie carte"
            >
              <Plus className="h-8 w-8" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
