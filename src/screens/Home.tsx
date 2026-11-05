import { useMemo, useState } from 'react'
import { Card, SearchField } from '../design-system'
import AppTabBar, { type Tab } from '../components/TabBar'
import ReportButton from '../components/ReportButton'
import ReportSheet from '../components/ReportSheet'
import CampusMap, { type MapMarker } from '../components/CampusMap'
import { places, start, type Place } from '../data/campus'

// Short map labels; some sit left of their pin so neighbors don't collide.
const mapLabels: Record<string, { label: string; side?: 'left' | 'right' }> = {
  'tech-tower': { label: 'Tech Tower' },
  clough: { label: 'Clough', side: 'left' },
  'student-center': { label: 'Student Center', side: 'left' },
  crc: { label: 'CRC' },
  library: { label: 'Library' },
}

export default function Home({
  onTab,
  onSearch,
  onPickPlace,
  onReport,
}: {
  onTab: (tab: Tab) => void
  onSearch: (query: string) => void
  onPickPlace: (place: Place) => void
  onReport: (concern: string) => void
}) {
  const [reporting, setReporting] = useState(false)

  const markers = useMemo<MapMarker[]>(
    () => [
      ...places.map((p) => ({
        id: p.id,
        kind: 'place' as const,
        at: [p.lng, p.lat] as [number, number],
        label: mapLabels[p.id]?.label ?? p.name,
        labelSide: mapLabels[p.id]?.side,
        onClick: () => onPickPlace(p),
      })),
      { id: 'you', kind: 'you', at: [start.lng, start.lat] },
    ],
    // Markers are created once; onPickPlace only routes to App state setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <div className="screen">
      <CampusMap
        className="map-home"
        camera={{ type: 'center', center: [-84.3972, 33.775], zoom: 14.8 }}
        padding={{ top: 262, bottom: 135 }}
        markers={markers}
      />

      <Card as="header" tone="accent" elevation="lg" className="hero">
        <p className="hero__tagline ww-text-title-xl">Be Safe. Walk Wise.</p>
        <p className="hero__campus">
          @ <strong>Georgia Tech</strong>
        </p>
        <SearchField className="hero__search" label="Search for a destination" onSubmit={onSearch} />
      </Card>

      <ReportButton top={reporting ? 434 : 719} onClick={() => setReporting(true)} />
      <AppTabBar active="home" onTab={onTab} />

      {reporting && (
        <ReportSheet
          onClose={() => setReporting(false)}
          onSubmit={(c) => {
            setReporting(false)
            onReport(c)
          }}
        />
      )}
    </div>
  )
}
