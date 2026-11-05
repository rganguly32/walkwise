import type { ReactNode } from 'react'

type BottomSheetProps = {
  title: string
  onClose: () => void
  children: ReactNode
  className?: string
}

export function BottomSheet({ title, onClose, children, className = '' }: BottomSheetProps) {
  return (
    <section className={`ww-sheet ${className}`.trim()} role="dialog" aria-label={title}>
      <header className="ww-sheet__header">
        <h2 className="ww-sheet__title">{title}</h2>
        <button className="ww-sheet__close" onClick={onClose} aria-label="Close">
          <img src="/assets/close.svg" alt="" width={40} height={40} />
        </button>
      </header>
      <div className="ww-sheet__body">{children}</div>
    </section>
  )
}
