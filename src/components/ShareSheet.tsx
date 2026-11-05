import { useState } from 'react'
import { BottomSheet, Button, Checkbox, Switch } from '../design-system'
import { CHECK_IN_GRACE_MIN, contacts, formatTime, minutesFromNow, type Share } from '../data/walk'

export default function ShareSheet({
  etaMinutes,
  onClose,
  onShare,
}: {
  etaMinutes: number
  onClose: () => void
  onShare: (share: Share) => void
}) {
  const [picked, setPicked] = useState<string[]>(['maya'])
  const [checkIn, setCheckIn] = useState(true)
  const deadline = minutesFromNow(etaMinutes + CHECK_IN_GRACE_MIN)

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  return (
    <BottomSheet className="app-sheet share-sheet" title="Share my walk" onClose={onClose}>
      <p className="share-sheet__intro ww-text-body">
        Your contacts will see your live location until you arrive.
      </p>

      <ul className="contact-list">
        {contacts.map((c) => {
          const on = picked.includes(c.id)
          return (
            <li key={c.id}>
              <button className="contact" onClick={() => toggle(c.id)} aria-pressed={on}>
                <span className="contact__avatar">{c.initials}</span>
                <span className="contact__text">
                  <span className="contact__name">{c.name}</span>
                  <span className="ww-text-caption">{c.relation}</span>
                </span>
                <Checkbox checked={on} />
              </button>
            </li>
          )
        })}
      </ul>

      <div className="check-in-row">
        <div>
          <p className="check-in-row__title">Check in when I arrive</p>
          <p className="ww-text-caption check-in-row__desc">
            If you're not there by <strong>{formatTime(deadline)}</strong>, we'll ask if you're OK, then alert your
            contacts.
          </p>
        </div>
        <Switch checked={checkIn} onChange={setCheckIn} label="Check in when I arrive" />
      </div>

      <Button block size="lg" disabled={picked.length === 0} onClick={() => onShare({ contactIds: picked, checkIn, deadline })}>
        Share &amp; start walk
      </Button>
    </BottomSheet>
  )
}
