import type { ReactNode } from 'react'

export function Toast({ children }: { children: ReactNode }) {
  return (
    <div className="ww-toast" role="status">
      {children}
    </div>
  )
}

type SafetyLevel = 'safe' | 'caution' | 'alert'

const defaultLabels: Record<SafetyLevel, string> = {
  safe: 'Safest',
  caution: 'Use caution',
  alert: 'Reported concern',
}

/** Small status pill for routes, segments and reports. */
export function SafetyBadge({ level, children }: { level: SafetyLevel; children?: ReactNode }) {
  return (
    <span className={`ww-badge ww-badge--${level}`}>
      <span className="ww-badge__dot" aria-hidden />
      {children ?? defaultLabels[level]}
    </span>
  )
}

/** Brand footpath motif: dashed walking trail used as a divider on navy. */
export function Footpath({ className = '' }: { className?: string }) {
  return <div className={`ww-footpath ${className}`.trim()} role="presentation" />
}
