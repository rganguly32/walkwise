import { useEffect, useMemo, useState } from 'react'
import { Button, Card } from '../design-system'
import ReportButton from '../components/ReportButton'
import ReportSheet from '../components/ReportSheet'
import CheckInPrompt from '../components/CheckInPrompt'
import CampusMap, { type MapMarker } from '../components/CampusMap'
import type { Place } from '../data/campus'
import { along, headingAhead } from '../data/geo'
import { contactNames, formatTime, type Route, type Share } from '../data/walk'

// Prototype only: show the "Are you OK?" check-in after this long so the flow
// can be demoed without waiting for the real deadline.
const DEMO_CHECK_IN_MS = 25_000
// Prototype only: simulate walking the whole route in this long.
const DEMO_WALK_MS = 90_000
const TICK_MS = 1000

export default function Navigation({
  place,
  route,
  share,
  onShareChange,
  onReport,
  onNotify,
  onEnd,
}: {
  place: Place
  route: Route
  share: Share | null
  onShareChange: (share: Share | null) => void
  onReport: (concern: string) => void
  onNotify: (message: string) => void
  onEnd: () => void
}) {
  const [reporting, setReporting] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const [demoFired, setDemoFired] = useState(false)
  const [progress, setProgress] = useState(0)
  const names = share ? contactNames(share.contactIds) : ''

  // Simulated walk: advance along the route, pausing while the check-in is open.
  useEffect(() => {
    if (checkingIn) return
    if (progress >= 1) {
      onEnd()
      return
    }
    const id = setTimeout(() => setProgress((p) => Math.min(1, p + TICK_MS / DEMO_WALK_MS)), TICK_MS)
    return () => clearTimeout(id)
  }, [progress, checkingIn, onEnd])

  const position = along(route.coords, progress).at
  const heading = headingAhead(route.coords, progress)
  const arriving = progress > 0.88

  const lines = useMemo(() => [{ id: route.id, coords: route.coords, selected: true }], [route])
  const markers = useMemo<MapMarker[]>(
    () => [
      { id: 'dest', kind: 'destination', at: [place.lng, place.lat], label: place.name },
      { id: 'you', kind: 'you', at: position },
    ],
    [place, position],
  )

  useEffect(() => {
    if (!share?.checkIn || demoFired) return
    const id = setTimeout(() => {
      setDemoFired(true)
      setReporting(false)
      setCheckingIn(true)
    }, DEMO_CHECK_IN_MS)
    return () => clearTimeout(id)
  }, [share, demoFired])

  const extendCheckIn = () => {
    if (!share) return
    const deadline = new Date(Math.max(share.deadline.getTime(), Date.now()) + 10 * 60_000)
    onShareChange({ ...share, deadline })
    setCheckingIn(false)
    onNotify(`Got it. Next check-in at ${formatTime(deadline)}.`)
  }

  return (
    <div className="screen">
      <CampusMap
        className="map-nav"
        camera={{ type: 'center', center: position, zoom: 17.6, pitch: 50, bearing: heading, follow: true }}
        padding={{ top: 420 }}
        lines={lines}
        lineStyle="dotted"
        markers={markers}
      />

      <Card tone="brand" className="direction">
        <img className="direction__arrow" src="/assets/arrow-turn-right.svg" alt="" width={88} height={88} />
        <p className="direction__text ww-text-title-lg">
          {arriving ? (
            <>
              Arriving at
              <br />
              {place.name}
            </>
          ) : (
            <>
              Continue
              <br />
              Straight Ahead
            </>
          )}
        </p>
      </Card>

      {share && (
        <div className="share-pill" role="status">
          <span className="share-pill__live" aria-hidden />
          <span>
            Sharing with <strong>{names}</strong>
            {share.checkIn && <> · Check-in {formatTime(share.deadline)}</>}
          </span>
        </div>
      )}

      <ReportButton top={reporting ? 434 : 719} onClick={() => setReporting(true)} />

      {!reporting && (
        <Button className="end-walk" variant="primary" elevated onClick={onEnd}>
          End walk
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

      {checkingIn && (
        <CheckInPrompt
          names={names}
          onOk={extendCheckIn}
          onEndAlert={() => {
            setCheckingIn(false)
            onNotify(`We told ${names} you're safe.`)
          }}
        />
      )}
    </div>
  )
}
