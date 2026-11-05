import type { ReactNode } from 'react'

type OptionTileProps = {
  label: string
  icon: ReactNode
  selected?: boolean
  onClick: () => void
}

/** 156×95 selectable tile used for report categories and other quick picks. */
export function OptionTile({ label, icon, selected = false, onClick }: OptionTileProps) {
  return (
    <button className={`ww-option${selected ? ' is-selected' : ''}`} onClick={onClick} aria-pressed={selected}>
      <span className="ww-option__label">{label}</span>
      <span className="ww-option__icon">{icon}</span>
    </button>
  )
}

export function OptionGrid({ children }: { children: ReactNode }) {
  return <div className="ww-option-grid">{children}</div>
}
