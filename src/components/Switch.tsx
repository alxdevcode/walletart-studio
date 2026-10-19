export function Switch({ checked, onChange, disabled, label }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 disabled:opacity-40 ${checked ? "bg-primary" : "bg-muted"}`}
    >
      <span
        className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-background shadow transition-transform duration-300 ease-out ${checked ? "translate-x-5" : ""}`}
      />
    </button>
  );
}
