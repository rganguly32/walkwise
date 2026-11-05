import { Card, SafetyBadge } from '../design-system'
import type { Route } from '../data/walk'

export default function RouteCard({
  route,
  selected,
  onSelect,
}: {
  route: Route
  selected: boolean
  onSelect: () => void
}) {
  return (
    <Card
      tone="surface"
      className={`route-card${selected ? ' is-selected' : ''}`}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
    >
      <div className="route-card__head">
        <span className="ww-text-heading">{route.name}</span>
        <SafetyBadge level={route.level}>{route.badge}</SafetyBadge>
      </div>
      <p className="route-card__meta ww-text-body">
        <strong>{route.minutes} min</strong> · {route.miles} mi
      </p>
      <ul className="route-card__reasons">
        {route.reasons.map((r) => (
          <li key={r.text} className={`reason reason--${r.tone}`}>
            <span className="reason__mark" aria-hidden>
              {r.tone === 'good' ? '✓' : '!'}
            </span>
            {r.text}
          </li>
        ))}
      </ul>
    </Card>
  )
}
