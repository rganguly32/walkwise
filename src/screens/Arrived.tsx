import { useState } from 'react'
import { Button, Card, Footpath } from '../design-system'
import { contactNames, type Route, type Share } from '../data/walk'

const ratings = [
  { id: 'safe', emoji: '😊', label: 'Safe' },
  { id: 'okay', emoji: '😐', label: 'Okay' },
  { id: 'unsafe', emoji: '😟', label: 'Unsafe' },
]

export default function Arrived({
  destination,
  route,
  share,
  onDone,
}: {
  destination: string
  route: Route
  share: Share | null
  onDone: () => void
}) {
  const [rating, setRating] = useState<string | null>(null)

  return (
    <div className="screen arrived">
      <img className="arrived__mascot" src="/brand/mascot.png" alt="" width={117} height={131} />
      <h1 className="arrived__title ww-text-display">You made it!</h1>
      <p className="arrived__summary ww-text-body-lg">
        {destination} · {route.minutes} min · {route.miles} mi
        <br />
        <span className="arrived__route">via {route.name.toLowerCase()}</span>
      </p>

      {share && (
        <p className="arrived__notified ww-text-label">
          <span aria-hidden>✓</span> {contactNames(share.contactIds)} {share.contactIds.length > 1 ? 'were' : 'was'}{' '}
          notified you arrived safely
        </p>
      )}

      <Footpath className="arrived__footpath" />

      <Card tone="surface" className="rate-card">
        <h2 className="ww-text-title rate-card__title">How safe did this route feel?</h2>
        <div className="rate-card__options" role="radiogroup" aria-label="Route safety rating">
          {ratings.map((r) => (
            <button
              key={r.id}
              className={`rating${rating === r.id ? ' is-selected' : ''}`}
              role="radio"
              aria-checked={rating === r.id}
              onClick={() => setRating(r.id)}
            >
              <span className="rating__emoji" aria-hidden>
                {r.emoji}
              </span>
              {r.label}
            </button>
          ))}
        </div>
        <p className="ww-text-caption rate-card__note">
          {rating ? 'Thanks! Your rating helps other students choose safer routes.' : 'Your rating is anonymous.'}
        </p>
        <Button block size="lg" onClick={onDone}>
          Done
        </Button>
      </Card>
    </div>
  )
}
