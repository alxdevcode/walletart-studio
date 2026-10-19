import { Link } from "@tanstack/react-router";
import { Home, Crop, Layers, Settings } from "lucide-react";
import type { ReactNode } from "react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/editor", label: "Editor", icon: Crop },
  { to: "/cards", label: "Carte", icon: Layers },
  { to: "/settings", label: "Impostazioni", icon: Settings },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-glass pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-md justify-around px-2 py-2">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: true, includeSearch: false }}
              className="group flex flex-col items-center gap-1 rounded-xl px-4 py-1.5 text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <Icon className="h-5 w-5 transition-transform group-active:scale-90" />
              <span className="text-[10px] font-semibold tracking-wide">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Page({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-28 pt-[max(env(safe-area-inset-top),1.5rem)]">
      <header className="mb-6 flex items-end justify-between gap-4 animate-rise">
        <div>
          {subtitle && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{subtitle}</p>}
          <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
        </div>
        {action}
      </header>
      <div className="animate-rise [animation-delay:80ms]">{children}</div>
    </main>
  );
}

export function Section({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="mb-5">
      {title && <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{title}</h2>}
      <div className="overflow-hidden rounded-2xl border bg-card">{children}</div>
    </section>
  );
}

export function StatusPill({ ok, okLabel, koLabel }: { ok: boolean | null; okLabel: string; koLabel: string }) {
  const tone = ok === null ? "bg-muted text-muted-foreground" : ok ? "bg-success/15 text-success" : "bg-warning/15 text-warning";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {ok === null ? "Non disponibile" : ok ? okLabel : koLabel}
    </span>
  );
}
