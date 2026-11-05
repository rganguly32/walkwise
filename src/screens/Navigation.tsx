import { useEffect, useState } from 'react'
import { Button, Card } from '../design-system'
import ReportButton from '../components/ReportButton'
import ReportSheet from '../components/ReportSheet'
import CheckInPrompt from '../components/CheckInPrompt'
import { contactNames, formatTime, type Share } from '../data/walk'

// Prototype only: show the "Are you OK?" check-in after this long so the flow
// can be demoed without waiting for the real deadline.
const DEMO_CHECK_IN_MS = 25_000

export default function Navigation({
  share,
  onShareChange,
  onReport,
  onNotify,
  onEnd,
}: {
  share: Share | null
  onShareChange: (share: Share | null) => void
  onReport: (concern: string) => void
  onNotify: (message: string) => void
  onEnd: () => void
}) {
  const [reporting, setReporting] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const [demoFired, setDemoFired] = useState(false)
  const names = share ? contactNames(share.contactIds) : ''

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
      <img className="map map--nav" src="/assets/nav-map.jpg" alt="Walking route map" />

      <Card tone="brand" className="direction">
        <img className="direction__arrow" src="/assets/arrow-turn-right.svg" alt="" width={88} height={88} />
        <p className="direction__text ww-text-title-lg">
          Continue
          <br />
          Straight Ahead
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
