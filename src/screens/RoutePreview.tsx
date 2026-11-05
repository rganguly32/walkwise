import { useMemo, useState } from 'react'
import { BottomSheet, Button, Card, IconButton } from '../design-system'
import RouteCard from '../components/RouteCard'
import ShareSheet from '../components/ShareSheet'
import CampusMap, { type MapMarker } from '../components/CampusMap'
import { start, type Place } from '../data/campus'
import { routesFor, type RouteId, type Share } from '../data/walk'

export default function RoutePreview({
  place,
  onBack,
  onStart,
}: {
  place: Place
  onBack: () => void
  onStart: (route: RouteId, share: Share | null) => void
}) {
  const [selected, setSelected] = useState<RouteId>('safest')
  const [sharing, setSharing] = useState(false)
  const routes = useMemo(() => routesFor(place), [place])
  const route = routes.find((r) => r.id === selected)!

  const lines = useMemo(
    () => routes.map((r) => ({ id: r.id, coords: r.coords, selected: r.id === selected })),
    [routes, selected],
  )
  const markers = useMemo<MapMarker[]>(
    () => [
      { id: 'concern', kind: 'concern', at: place.concern, label: 'Reported concern' },
      ...place.bluePhones.map((at, i) => ({ id: `phone-${i}`, kind: 'phone' as const, at, label: 'Blue-light phone' })),
      { id: 'dest', kind: 'destination', at: [place.lng, place.lat], label: place.name },
      { id: 'you', kind: 'you', at: [start.lng, start.lat] },
    ],
    [place],
  )
  const fitCoords = useMemo(() => routes.flatMap((r) => r.coords), [routes])

  return (
    <div className="screen">
      <CampusMap
        className="route-preview-map"
        camera={{ type: 'fit', coords: fitCoords }}
        padding={{ top: 190, bottom: 560, left: 50, right: 50 }}
        lines={lines}
        markers={markers}
      />

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
            <strong>{place.name}</strong>
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
