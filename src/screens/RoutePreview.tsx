import { useState } from 'react'
import { BottomSheet, Button, Card, IconButton } from '../design-system'
import RouteCard from '../components/RouteCard'
import ShareSheet from '../components/ShareSheet'
import { routes, type RouteId, type Share } from '../data/walk'

export default function RoutePreview({
  destination,
  onBack,
  onStart,
}: {
  destination: string
  onBack: () => void
  onStart: (route: RouteId, share: Share | null) => void
}) {
  const [selected, setSelected] = useState<RouteId>('safest')
  const [sharing, setSharing] = useState(false)
  const route = routes.find((r) => r.id === selected)!
  // Draw the unselected route first so the selected one sits on top.
  const ordered = [...routes].sort((a) => (a.id === selected ? 1 : -1))

  return (
    <div className="screen">
      <img className="map map--preview" src="/assets/home-map.png" alt="Map of Georgia Tech campus" />

      <svg className="route-overlay" viewBox="0 0 430 932" aria-hidden>
        {ordered.map((r) => (
          <path key={r.id} d={r.path} className={`route-line${r.id === selected ? ' is-selected' : ''}`} />
        ))}
        <circle cx="120" cy="196" r="13" className="dest-pin" />
        <circle cx="120" cy="196" r="5" fill="#fff" />
      </svg>
      <img className="you-dot you-dot--preview" src="/assets/location-dot.svg" alt="Your location" width={45} height={45} />

      <Card tone="surface" elevation="sm" className="trip-card">
        <IconButton tone="plain" size="sm" aria-label="Back" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </IconButton>
        <div className="trip-card__stops">
          <p className="trip-card__stop">
            <span className="trip-card__dot trip-card__dot--from" />
            Your location
          </p>
          <p className="trip-card__stop">
            <span className="trip-card__dot trip-card__dot--to" />
            <strong>{destination}</strong>
          </p>
        </div>
      </Card>

      <BottomSheet className="app-sheet route-sheet" title="Choose your route" onClose={onBack}>
        <div className="route-list" role="radiogroup" aria-label="Routes">
          {routes.map((r) => (
            <RouteCard key={r.id} route={r} selected={r.id === selected} onSelect={() => setSelected(r.id)} />
          ))}
        </div>
        <div className="route-actions">
          <Button variant="secondary" block onClick={() => setSharing(true)}>
            Share my walk
          </Button>
          <Button block onClick={() => onStart(selected, null)}>
            Start walk
          </Button>
        </div>
      </BottomSheet>

      {sharing && (
        <ShareSheet
          etaMinutes={route.minutes}
          onClose={() => setSharing(false)}
          onShare={(share) => onStart(selected, share)}
        />
      )}
    </div>
  )
}
