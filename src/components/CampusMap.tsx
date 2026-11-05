import { useEffect, useRef } from 'react'
import maplibregl, { type LngLatBoundsLike, type PaddingOptions } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { LngLat } from '../data/campus'

// Free vector tiles from OpenFreeMap (OpenStreetMap data). No API key needed.
const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron'

export type MapLine = { id: string; coords: LngLat[]; selected?: boolean }

export type MapMarker = {
  id: string
  kind: 'you' | 'destination' | 'concern' | 'phone' | 'place'
  at: LngLat
  label?: string
  /** Which side of a place pin its label sits on */
  labelSide?: 'left' | 'right'
  onClick?: () => void
}

export type Camera =
  | { type: 'center'; center: LngLat; zoom: number; pitch?: number; bearing?: number; follow?: boolean }
  | { type: 'fit'; coords: LngLat[] }

type CampusMapProps = {
  camera: Camera
  /** Space covered by overlays, so centering/fitting happens in the visible area */
  padding?: Partial<PaddingOptions>
  lines?: MapLine[]
  lineStyle?: 'route' | 'dotted'
  markers?: MapMarker[]
  className?: string
}

const NAVY = '#202a56'
const GRAY = '#9a9ca6'
const BLUE = '#3a5bff'

function markerElement(m: MapMarker) {
  const el = document.createElement('div')
  el.className = `map-marker map-marker--${m.kind}${m.labelSide === 'left' ? ' map-marker--label-left' : ''}`
  if (m.label) el.title = m.label
  if (m.kind === 'you') {
    const img = document.createElement('img')
    img.src = '/assets/location-dot.svg'
    img.alt = 'Your location'
    img.width = 45
    img.height = 45
    el.appendChild(img)
  }
  if (m.kind === 'concern') el.textContent = '!'
  if (m.kind === 'place' && m.label) {
    el.innerHTML = '<span class="map-marker__pin"></span><span class="map-marker__label"></span>'
    el.querySelector('.map-marker__label')!.textContent = m.label
  }
  if (m.onClick) {
    el.setAttribute('role', 'button')
    el.tabIndex = 0
    el.addEventListener('click', m.onClick)
  }
  return el
}

/** Place markers anchor on their pin (not the label) so the pin sits on the spot. */
function markerOptions(m: MapMarker): maplibregl.MarkerOptions {
  const element = markerElement(m)
  if (m.kind !== 'place') return { element }
  const PIN_HALF = 7
  return m.labelSide === 'left'
    ? { element, anchor: 'right', offset: [PIN_HALF, 0] }
    : { element, anchor: 'left', offset: [-PIN_HALF, 0] }
}

function linesToGeoJSON(lines: MapLine[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: lines.map((l) => ({
      type: 'Feature',
      properties: { id: l.id, selected: !!l.selected },
      geometry: { type: 'LineString', coordinates: l.coords },
    })),
  }
}

function boundsOf(coords: LngLat[]): LngLatBoundsLike {
  const b = new maplibregl.LngLatBounds(coords[0], coords[0])
  coords.forEach((c) => b.extend(c))
  return b
}

export default function CampusMap({
  camera,
  padding = {},
  lines = [],
  lineStyle = 'route',
  markers = [],
  className = '',
}: CampusMapProps) {
  const container = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const loaded = useRef(false)
  const markerRefs = useRef<Map<string, maplibregl.Marker>>(new Map())
  const latest = useRef({ lines, camera, padding })
  latest.current = { lines, camera, padding }

  // Create the map once.
  useEffect(() => {
    const initial = latest.current.camera
    const m = new maplibregl.Map({
      container: container.current!,
      style: STYLE_URL,
      center: initial.type === 'center' ? initial.center : initial.coords[0],
      zoom: initial.type === 'center' ? initial.zoom : 15,
      pitch: initial.type === 'center' ? (initial.pitch ?? 0) : 0,
      bearing: initial.type === 'center' ? (initial.bearing ?? 0) : 0,
      attributionControl: { compact: true },
      dragRotate: false,
      pitchWithRotate: false,
    })
    m.touchZoomRotate.disableRotation()
    map.current = m

    m.on('load', () => {
      m.addSource('routes', { type: 'geojson', data: linesToGeoJSON(latest.current.lines) })
      if (lineStyle === 'dotted') {
        m.addLayer({
          id: 'route-dots',
          type: 'line',
          source: 'routes',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': BLUE, 'line-width': 9, 'line-dasharray': [0, 1.8] },
        })
      } else {
        m.addLayer({
          id: 'route-casing',
          type: 'line',
          source: 'routes',
          layout: { 'line-cap': 'round', 'line-join': 'round', 'line-sort-key': ['case', ['get', 'selected'], 1, 0] },
          paint: { 'line-color': '#ffffff', 'line-width': ['case', ['get', 'selected'], 11, 8] },
        })
        m.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'routes',
          layout: { 'line-cap': 'round', 'line-join': 'round', 'line-sort-key': ['case', ['get', 'selected'], 1, 0] },
          paint: {
            'line-color': ['case', ['get', 'selected'], NAVY, GRAY],
            'line-width': ['case', ['get', 'selected'], 7, 5],
          },
        })
      }
      loaded.current = true
      // Start the attribution collapsed to its (i) button.
      m.getContainer().querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show')
      applyCamera(m, latest.current.camera, latest.current.padding, false)
    })

    return () => {
      markerRefs.current.forEach((mk) => mk.remove())
      markerRefs.current.clear()
      loaded.current = false
      m.remove()
      map.current = null
    }
  }, [lineStyle])

  // Keep route lines in sync.
  useEffect(() => {
    const m = map.current
    if (!m || !loaded.current) return
    ;(m.getSource('routes') as maplibregl.GeoJSONSource | undefined)?.setData(linesToGeoJSON(lines))
  }, [lines])

  // Keep markers in sync (create, move, remove).
  useEffect(() => {
    const m = map.current
    if (!m) return
    const seen = new Set<string>()
    markers.forEach((mk) => {
      seen.add(mk.id)
      const existing = markerRefs.current.get(mk.id)
      if (existing) existing.setLngLat(mk.at)
      else markerRefs.current.set(mk.id, new maplibregl.Marker(markerOptions(mk)).setLngLat(mk.at).addTo(m))
    })
    markerRefs.current.forEach((mk, id) => {
      if (!seen.has(id)) {
        mk.remove()
        markerRefs.current.delete(id)
      }
    })
  }, [markers])

  // Move the camera when it changes.
  const cameraKey = JSON.stringify(camera)
  useEffect(() => {
    const m = map.current
    if (!m || !loaded.current) return
    applyCamera(m, latest.current.camera, latest.current.padding, true)
  }, [cameraKey])

  return <div ref={container} className={`campus-map ${className}`.trim()} />
}

function applyCamera(m: maplibregl.Map, camera: Camera, padding: Partial<PaddingOptions>, animate: boolean) {
  const pad = { top: 0, bottom: 0, left: 0, right: 0, ...padding }
  if (camera.type === 'fit') {
    m.fitBounds(boundsOf(camera.coords), { padding: pad, duration: animate ? 600 : 0, maxZoom: 17.5 })
  } else {
    m.easeTo({
      center: camera.center,
      zoom: camera.zoom,
      pitch: camera.pitch ?? 0,
      bearing: camera.bearing ?? 0,
      padding: pad,
      // "follow" cameras update every second, so glide linearly between updates.
      duration: animate ? (camera.follow ? 1000 : 900) : 0,
      easing: camera.follow ? (t) => t : undefined,
    })
  }
}
