// Prototype data: route options, contacts and sharing helpers.

import type { LngLat, Place } from './campus'

export type RouteId = 'safest' | 'fastest'

export type Reason = { tone: 'good' | 'warn'; text: string }

export type Route = {
  id: RouteId
  name: string
  minutes: number
  miles: number
  level: 'safe' | 'caution'
  badge: string
  reasons: Reason[]
  /** How this route compares on time, e.g. "+2 min vs fastest" */
  note?: string
  coords: LngLat[]
}

const METERS_PER_MILE = 1609.34

/** Build the two route options for a destination from its real geometry. */
export function routesFor(place: Place): Route[] {
  const toMin = (sec: number) => Math.max(1, Math.round(sec / 60))
  const summary = (g: Place['safest']) => ({
    minutes: toMin(g.seconds),
    miles: Math.round((g.meters / METERS_PER_MILE) * 10) / 10,
    coords: g.coords,
  })
  const extraMin = toMin(place.safest.seconds) - toMin(place.fastest.seconds)
  return [
    {
      id: 'safest',
      note: extraMin < 1 ? 'Same time as fastest' : `+${extraMin} min vs fastest`,
      name: 'Safest route',
      level: 'safe',
      badge: 'Safest',
      reasons: [
        { tone: 'good', text: 'Well-lit the whole way' },
        { tone: 'good', text: `Passes ${place.bluePhones.length} blue-light phones` },
        { tone: 'good', text: 'Avoids 1 reported concern' },
      ],
      ...summary(place.safest),
    },
    {
      id: 'fastest',
      name: 'Fastest route',
      level: 'caution',
      badge: 'Use caution',
      reasons: [
        { tone: 'warn', text: 'Poor lighting on 1 block' },
        { tone: 'warn', text: 'Passes 1 reported concern' },
      ],
      ...summary(place.fastest),
    },
  ]
}

export type Contact = { id: string; name: string; relation: string; initials: string }

export const contacts: Contact[] = [
  { id: 'maya', name: 'Maya Patel', relation: 'Roommate', initials: 'MP' },
  { id: 'jordan', name: 'Jordan Lee', relation: 'Friend', initials: 'JL' },
  { id: 'mom', name: 'Mom', relation: 'Family', initials: 'M' },
]

export type Share = {
  contactIds: string[]
  checkIn: boolean
  /** Time we expect you to arrive, plus a grace period */
  deadline: Date
}

export const CHECK_IN_GRACE_MIN = 5

export function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function minutesFromNow(min: number) {
  return new Date(Date.now() + min * 60_000)
}

/** "Maya", "Maya and Jordan", "Maya, Jordan and Mom" */
export function contactNames(ids: string[]) {
  const names = ids.map((id) => contacts.find((c) => c.id === id)!.name.split(' ')[0])
  if (names.length <= 1) return names.join('')
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}
