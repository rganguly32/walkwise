// Sample data for the prototype. Nothing here comes from a real routing API.

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
  /** SVG path over the 430×932 preview map */
  path: string
}

export const routes: Route[] = [
  {
    id: 'safest',
    name: 'Safest route',
    minutes: 12,
    miles: 0.6,
    level: 'safe',
    badge: 'Safest',
    reasons: [
      { tone: 'good', text: 'Well-lit the whole way' },
      { tone: 'good', text: 'Passes 2 blue-light phones' },
      { tone: 'good', text: 'Avoids 1 reported concern' },
    ],
    path: 'M215 348 L300 348 L300 262 L262 222 L150 222 L120 196',
  },
  {
    id: 'fastest',
    name: 'Fastest route',
    minutes: 9,
    miles: 0.4,
    level: 'caution',
    badge: 'Use caution',
    reasons: [
      { tone: 'warn', text: 'Poor lighting on 1 block' },
      { tone: 'warn', text: 'Passes 1 reported concern' },
    ],
    path: 'M215 348 L188 300 L160 262 L120 196',
  },
]

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
