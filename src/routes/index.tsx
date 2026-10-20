import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Plus, X, Pencil, CreditCard } from "lucide-react";
import { setState, useAppState } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: WalletHome,
});

function WalletHome() {
  const { designs, activeId } = useAppState();
  const [showMore, setShowMore] = useState(false);

  const active = designs.find((d) => d.id === activeId);

  return (
    <main
      className="fixed inset-0 z-50 flex flex-col overflow-hidden text-white"
      style={{ background: "#1c1d22" }}
    >
      {/* Intestazione */}
      <header className="flex items-center justify-between px-5 pt-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#303238]">
          <img
            src="/wallet-logo.png"
            alt="Logo Wallet"
            className="h-9 w-9 object-contain"
          />
        </div>

        <img
          src="/profile.jpg"
          alt="Profilo"
          className="h-14 w-14 rounded-full object-cover"
        />
      </header>

      {/* Carta */}
      <section className="mt-14 px-5">
        <div
          className="relative w-full overflow-hidden rounded-[20px] bg-black shadow-xl"
          style={{ aspectRatio: "1.586" }}
        >
          {active?.rendered ? (
            <img
              src={active.rendered}
              alt="Tema della carta"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <CreditCard size={42} />
              <span>Nessuna grafica selezionata</span>
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-xl font-medium">
          Alex
        </p>

        <div className="mt-5 flex justify-center">
          <div className="rounded-full bg-[#393b44] px-5 py-3 text-sm font-medium text-[#b8cbff]">
            Anteprima carta · NFC non attivo
          </div>
        </div>
      </section>

      <div className="flex-1" />

      {/* Barra inferiore */}
      <div className="mb-12 flex justify-center px-5">
        <div className="flex h-[68px] gap-1">
          <button
            type="button"
            onClick={() => setShowMore(true)}
            className="rounded-l-full rounded-r-md bg-[#38393f] px-9 text-lg font-medium text-[#b8cbff]"
          >
            Mostra altro
          </button>

          <Link
            to="/editor"
            search={{}}
            aria-label="Aggiungi tema"
            className="flex w-[76px] items-center justify-center rounded-l-md rounded-r-full bg-[#38393f] text-[#b8cbff]"
          >
            <Plus size={34} />
          </Link>
        </div>
      </div>

      {/* Pannello temi */}
      {showMore && (
        <div className="absolute inset-0 z-50 flex items-end bg-black/65">
          <div className="max-h-[80dvh] w-full overflow-y-auto rounded-t-[28px] bg-[#292a30] px-5 pb-10 pt-5">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Temi della carta
              </h2>

              <button
                type="button"
                onClick={() => setShowMore(false)}
                aria-label="Chiudi"
                className="rounded-full bg-white/10 p-2"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {designs.map((design) => {
                const selected = design.id === activeId;

                return (
                  <button
                    key={design.id}
                    type="button"
                    onClick={() => {
                      setState({ activeId: design.id });
                      setShowMore(false);
                    }}
                    className="text-left"
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
                        <span className="absolute right-2 top-2 rounded-full bg-[#a8c7fa] p-1 text-black">
                          <Check size={16} />
                        </span>
                      )}
                    </div>

                    <p className="mt-2 truncate text-sm">
                      {design.name}
                    </p>
                  </button>
                );
              })}
            </div>

            <Link
              to="/editor"
              search={active ? { id: active.id } : {}}
              className="mt-8 flex items-center justify-center gap-2 rounded-full bg-[#41434d] py-4 text-[#b8cbff]"
            >
              <Pencil size={18} />
              Modifica carta
            </Link>

            <p className="mt-5 text-center text-xs text-white/45">
              Personalizzazione visiva. Nessuna funzione di pagamento.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
