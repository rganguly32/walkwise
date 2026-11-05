import { useEffect, useState } from 'react'
import { Button, Card } from '../design-system'

const COUNTDOWN_SECONDS = 30

export default function CheckInPrompt({
  names,
  onOk,
  onEndAlert,
}: {
  names: string
  onOk: () => void
  onEndAlert: () => void
}) {
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS)
  const alerted = seconds <= 0

  useEffect(() => {
    if (alerted) return
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [seconds, alerted])

  return (
    <div className="scrim" role="alertdialog" aria-labelledby="check-in-title">
      <Card tone="surface" elevation="lg" className="check-in">
        <span className="check-in__mascot">
          <img src="/brand/mascot.png" alt="" width={56} height={63} />
        </span>
        {alerted ? (
          <>
            <h2 id="check-in-title" className="ww-text-heading check-in__title">
              We alerted {names}
            </h2>
            <p className="ww-text-body check-in__body">
              They can see your live location. If you're in danger, call 911 or campus police.
            </p>
            <div className="check-in__actions">
              <Button variant="accent" block onClick={() => setSeconds(COUNTDOWN_SECONDS)}>
                Call campus police
              </Button>
              <Button variant="secondary" block onClick={onEndAlert}>
                I'm safe now
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 id="check-in-title" className="ww-text-heading check-in__title">
              Are you OK?
            </h2>
            <p className="ww-text-body check-in__body">
              You haven't arrived yet. We'll alert {names} in
            </p>
            <p className="check-in__count" aria-live="polite">
              0:{String(seconds).padStart(2, '0')}
            </p>
            <div className="check-in__actions">
              <Button block size="lg" onClick={onOk}>
                I'm OK
              </Button>
              <Button variant="accent" block onClick={() => setSeconds(0)}>
                Get help now
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
