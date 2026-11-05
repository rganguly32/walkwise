import { useState } from 'react'
import { Button, Card } from '../design-system'
import ReportButton from '../components/ReportButton'
import ReportSheet from '../components/ReportSheet'

export default function Navigation({
  destination,
  onReport,
  onEnd,
}: {
  destination: string
  onReport: (concern: string) => void
  onEnd: () => void
}) {
  const [reporting, setReporting] = useState(false)

  return (
    <div className="screen">
      <img className="map map--nav" src="/assets/nav-map.jpg" alt="Walking route map" />

      <Card tone="brand" className="direction">
        <img className="direction__arrow" src="/assets/arrow-turn-right.svg" alt="" width={88} height={88} />
        <p className="direction__text ww-text-title-lg">
          Continue
          <br />
          Straight Ahead
        </p>
      </Card>

      <ReportButton top={reporting ? 434 : 719} onClick={() => setReporting(true)} />

      {!reporting && (
        <Button className="end-walk" variant="primary" elevated onClick={onEnd}>
          End walk{destination && <span className="end-walk__dest"> · {destination}</span>}
        </Button>
      )}

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
