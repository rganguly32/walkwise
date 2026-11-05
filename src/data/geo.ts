import type { LngLat } from './campus'

const toRad = (d: number) => (d * Math.PI) / 180

/** Approximate distance in meters (fine at campus scale). */
export function distance(a: LngLat, b: LngLat) {
  const k = 111_320
  const dx = (b[0] - a[0]) * k * Math.cos(toRad(a[1]))
  const dy = (b[1] - a[1]) * k
  return Math.hypot(dx, dy)
}

/** Compass bearing in degrees from a to b. */
export function bearing(a: LngLat, b: LngLat) {
  const y = Math.sin(toRad(b[0] - a[0])) * Math.cos(toRad(b[1]))
  const x =
    Math.cos(toRad(a[1])) * Math.sin(toRad(b[1])) -
    Math.sin(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.cos(toRad(b[0] - a[0]))
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

/** Point and heading at a fraction (0–1) of the way along a line. */
export function along(coords: LngLat[], fraction: number): { at: LngLat; heading: number } {
  const total = coords.slice(1).reduce((sum, c, i) => sum + distance(coords[i], c), 0)
  let target = Math.min(Math.max(fraction, 0), 1) * total
  for (let i = 1; i < coords.length; i++) {
    const seg = distance(coords[i - 1], coords[i])
    if (target <= seg || i === coords.length - 1) {
      const t = seg === 0 ? 0 : Math.min(target / seg, 1)
      const [a, b] = [coords[i - 1], coords[i]]
      return { at: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], heading: bearing(a, b) }
    }
    target -= seg
  }
  return { at: coords[coords.length - 1], heading: 0 }
}

/** Heading over the next stretch of the route, smoothed to avoid jitter. */
export function headingAhead(coords: LngLat[], fraction: number, lookAhead = 0.08) {
  const here = along(coords, fraction).at
  const ahead = along(coords, Math.min(fraction + lookAhead, 1)).at
  return distance(here, ahead) < 1 ? along(coords, fraction).heading : bearing(here, ahead)
}
