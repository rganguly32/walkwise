type SwitchProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      className={`ww-switch${checked ? ' is-on' : ''}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span className="ww-switch__thumb" />
    </button>
  )
}

/** Visual checkbox; put it inside a clickable row that owns the state. */
export function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span className={`ww-checkbox${checked ? ' is-checked' : ''}`} aria-hidden>
      <svg viewBox="0 0 16 16" width="14" height="14">
        <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}
