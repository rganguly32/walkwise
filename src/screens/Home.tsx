import { useState } from 'react'
import { Card, SearchField } from '../design-system'
import AppTabBar, { type Tab } from '../components/TabBar'
import ReportButton from '../components/ReportButton'
import ReportSheet from '../components/ReportSheet'

export default function Home({
  onTab,
  onSearch,
  onReport,
}: {
  onTab: (tab: Tab) => void
  onSearch: (query: string) => void
  onReport: (concern: string) => void
}) {
  const [reporting, setReporting] = useState(false)

  return (
    <div className="screen">
      <img className="map map--home" src="/assets/home-map.png" alt="Map of Georgia Tech campus" />

      <Card as="header" tone="accent" elevation="lg" className="hero">
        <p className="hero__tagline ww-text-title-xl">Be Safe. Walk Wise.</p>
        <p className="hero__campus">
          @ <strong>Georgia Tech</strong>
        </p>
        <SearchField
          className="hero__search"
          label="Search for a destination"
          onSubmit={(q) => onSearch(q || 'Tech Tower')}
        />
      </Card>

      <img className="you-dot" src="/assets/location-dot.svg" alt="Your location" width={45} height={45} />

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
