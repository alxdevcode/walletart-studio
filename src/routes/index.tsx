import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Check,
  Plus,
  X,
  Pencil,
  CreditCard,
  ChevronLeft,
  Palette,
  Save,
} from "lucide-react";
import { setState, useAppState } from "@/lib/store";

type CardDetails = {
  holder: string;
  issuer: string;
  network: string;
  lastFour: string;
  memberSince: string;
};

const STORAGE_KEY = "walletart-card-details-v1";

const defaultDetails: CardDetails = {
  holder: "Alex",
  issuer: "American Express",
  network: "American Express",
  lastFour: "",
  memberSince: "",
};

export const Route = createFileRoute("/")({
  component: WalletHome,
});

function ContactlessIcon() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#b8cbff]">
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#30333c"
        strokeWidth="2.7"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M5 9a6 6 0 0 1 0 6" />
        <path d="M10 6a11 11 0 0 1 0 12" />
        <path d="M15 3a16 16 0 0 1 0 18" />
      </svg>
    </span>
  );
}

function WalletHome() {
  const { designs, activeId } = useAppState();

  const [showMore, setShowMore] = useState(false);
  const [page, setPage] = useState<"menu" | "themes" | "details">("menu");

  const [details, setDetails] = useState<CardDetails>(defaultDetails);
  const [draft, setDraft] = useState<CardDetails>(defaultDetails);
  const [loaded, setLoaded] = useState(false);

  const active = designs.find((d) => d.id === activeId);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved) as Partial<CardDetails>;
        const next = { ...defaultDetails, ...parsed };

        setDetails(next);
        setDraft(next);
      }
    } catch (error) {
      console.warn("Impossibile leggere i dettagli carta", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  function openPanel(nextPage: "menu" | "themes" | "details") {
    setPage(nextPage);
    setDraft(details);
    setShowMore(true);
  }

  function saveDetails() {
    const cleaned: CardDetails = {
      holder: draft.holder.trim().slice(0, 50),
      issuer: draft.issuer.trim().slice(0, 50),
      network: draft.network.trim().slice(0, 40),
      lastFour: draft.lastFour.replace(/\D/g, "").slice(0, 4),
      memberSince: draft.memberSince.replace(/\D/g, "").slice(0, 4),
    };

    if (cleaned.lastFour && cleaned.lastFour.length !== 4) {
      alert("Inserisci esattamente 4 cifre oppure lascia il campo vuoto.");
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      setDetails(cleaned);
      setDraft(cleaned);
      setPage("menu");
    } catch {
      alert("Non è stato possibile salvare i dati sul dispositivo.");
    }
  }

  return (
    <main
      className="fixed inset-0 z-50 flex flex-col overflow-hidden text-white"
      style={{ background: "#1c1d22" }}
    >
      {/* Logo e profilo */}
      <header className="flex items-center justify-between px-5 pt-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#303238]">
          <img
            src="/wallet-logo.png"
            alt="Logo Wallet"
            className="h-9 w-9 object-contain"
          />
        
<div
  className="relative w-full overflow-hidden rounded-[20px] bg-black shadow-xl"
  style={{ aspectRatio: "1.586" }}
>
  {active?.rendered ? (
    <>
      <img
        src={active.rendered}
        alt="Grafica della carta personalizzata"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dati sovrapposti soltanto nella Home */}
      <div
        className="pointer-events-none absolute bottom-[9%] left-[5%] max-w-[55%] truncate text-white"
        style={{
          fontSize: "clamp(14px, 4.5vw, 30px)",
          fontWeight: 400,
          textShadow: "0 1px 3px rgba(0,0,0,0.6)",
        }}
      >
        {details.holder || "Alex"}
      </div>

      {details.memberSince && (
        <div
          className="pointer-events-none absolute bottom-[9%] right-[13%] text-white"
          style={{
            fontSize: "clamp(14px, 4.5vw, 30px)",
            fontWeight: 400,
            textShadow: "0 1px 3px rgba(0,0,0,0.6)",
          }}
        >
          {details.memberSince}
        </div>
      )}
    </>
  ) : (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <CreditCard size={42} />
      <span>Nessuna grafica selezionata</span>
    </div>
  )}
</div>


        <div className="mt-5 text-center">
          <p className="text-xl font-medium">
            {loaded ? details.holder || "Titolare" : "Alex"}
          </p>

          {loaded && details.lastFour && (
            <p className="mt-1 text-sm tracking-[0.12em] text-white/60">
              •••• {details.lastFour}
            </p>
          )}
        </div>

        {/* Indicatore solo estetico */}
        <div className="mt-6 flex justify-center">
          <div
            className="inline-flex items-center justify-center gap-3 rounded-full bg-[#41434d] px-6 py-3.5 text-[#b8cbff]"
            aria-label="Avvicina al lettore, simulazione estetica"
          >
            <ContactlessIcon />

            <span className="whitespace-nowrap text-[17px] font-semibold">
              Avvicina al lettore
            </span>
          </div>
        </div>
      </section>

      <div className="flex-1" />

      {/* Pulsanti inferiori */}
      <div className="mb-12 flex justify-center px-5">
        <div className="flex h-[68px] gap-1">
          <button
            type="button"
            onClick={() => openPanel("menu")}
            className="rounded-l-full rounded-r-md bg-[#38393f] px-9 text-lg font-medium text-[#b8cbff]"
          >
            Mostra altro
          </button>

          <Link
            to="/editor"
            search={{}}
            aria-label="Crea una grafica"
            className="flex w-[76px] items-center justify-center rounded-l-md rounded-r-full bg-[#38393f] text-[#b8cbff]"
          >
            <Plus size={34} />
          </Link>
        </div>
      </div>

      {/* Pannello inferiore */}
      {showMore && (
        <div className="absolute inset-0 z-50 flex items-end bg-black/65">
          <div className="max-h-[82dvh] w-full overflow-y-auto rounded-t-[28px] bg-[#292a30] px-5 pb-10 pt-5">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {page !== "menu" && (
                  <button
                    type="button"
                    onClick={() => setPage("menu")}
                    aria-label="Indietro"
                    className="rounded-full bg-white/10 p-2"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}

                <h2 className="text-xl font-semibold">
                  {page === "menu"
                    ? "La tua carta"
                    : page === "themes"
                      ? "Temi della carta"
                      : "Dettagli carta"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowMore(false)}
                aria-label="Chiudi"
                className="rounded-full bg-white/10 p-2"
              >
                <X size={22} />
              </button>
            </div>

            {page === "menu" && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPage("themes")}
                  className="flex w-full items-center gap-4 rounded-2xl bg-white/5 p-5 text-left"
                >
                  <Palette className="text-[#b8cbff]" size={24} />
                  <div>
                    <p className="font-semibold">Cambia tema</p>
                    <p className="mt-1 text-sm text-white/50">
                      Scegli una grafica salvata
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDraft(details);
                    setPage("details");
                  }}
                  className="flex w-full items-center gap-4 rounded-2xl bg-white/5 p-5 text-left"
                >
                  <CreditCard className="text-[#b8cbff]" size={24} />
                  <div>
                    <p className="font-semibold">Dettagli carta</p>
                    <p className="mt-1 text-sm text-white/50">
                      Titolare, circuito e ultime quattro cifre
                    </p>
                  </div>
                </button>

                <Link
                  to="/editor"
                  search={active ? { id: active.id } : {}}
                  className="flex items-center gap-4 rounded-2xl bg-white/5 p-5"
                >
                  <Pencil className="text-[#b8cbff]" size={24} />
                  <div>
                    <p className="font-semibold">Modifica grafica</p>
                    <p className="mt-1 text-sm text-white/50">
                      Personalizza la carta nell'editor
                    </p>
                  </div>
                </Link>
              </div>
            )}

            {page === "themes" && (
              <>
                {designs.length === 0 ? (
                  <p className="text-sm text-white/60">
                    Non hai ancora salvato nessun tema.
                  </p>
                ) : (
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
                )}

                <Link
                  to="/editor"
                  search={{}}
                  className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#41434d] py-4 text-[#b8cbff]"
                >
                  <Plus size={18} />
                  Crea un nuovo tema
                </Link>
              </>
            )}

            {page === "details" && (
              <div className="space-y-5">
                <p className="text-sm leading-relaxed text-white/60">
                  Salva soltanto informazioni descrittive.
                  Non inserire il numero completo della carta,
                  il CVV, il PIN o codici di verifica.
                </p>

                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm text-white/70">
                      Nome del titolare
                    </span>
                    <input
                      type="text"
                      maxLength={50}
                      value={draft.holder}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          holder: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-[#393b44] p-4 text-white outline-none focus:border-[#a8c7fa]"
                      placeholder="Alex"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-white/70">
                      Banca o emittente
                    </span>
                    <input
                      type="text"
                      maxLength={50}
                      value={draft.issuer}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          issuer: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-[#393b44] p-4 text-white outline-none focus:border-[#a8c7fa]"
                      placeholder="American Express"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-white/70">
                      Circuito
                    </span>
                    <select
                      value={draft.network}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          network: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-[#393b44] p-4 text-white outline-none focus:border-[#a8c7fa]"
                    >
                      <option>American Express</option>
                      <option>Visa</option>
                      <option>Mastercard</option>
                      <option>Altro</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-white/70">
                      Ultime 4 cifre
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={4}
                      value={draft.lastFour}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          lastFour: e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4),
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-[#393b44] p-4 text-white outline-none focus:border-[#a8c7fa]"
                      placeholder="1234"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-white/70">
                      Member Since (anno, facoltativo)
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={4}
                      value={draft.memberSince}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          memberSince: e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4),
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-[#393b44] p-4 text-white outline-none focus:border-[#a8c7fa]"
                      placeholder="2024"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={saveDetails}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#b8cbff] py-4 font-semibold text-[#202127]"
                >
                  <Save size={19} />
                  Salva dettagli
                </button>
              </div>
            )}

            <p className="mt-7 text-center text-xs text-white/40">
              Demo grafica · Nessuna funzione di pagamento NFC
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
