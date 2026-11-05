import { useCallback, useEffect, useMemo, useState } from 'react'
import { Toast } from './design-system'
import Splash from './screens/Splash'
import Home from './screens/Home'
import RoutePreview from './screens/RoutePreview'
import Navigation from './screens/Navigation'
import Arrived from './screens/Arrived'
import Placeholder from './screens/Placeholder'
import type { Tab } from './components/TabBar'
import { places, type Place } from './data/campus'
import { contactNames, routesFor, type RouteId, type Share } from './data/walk'

type Screen = 'splash' | 'home' | 'saved' | 'settings' | 'preview' | 'navigation' | 'arrived'

const aliases: Record<string, string[]> = {
  'tech-tower': ['tech tower'],
  clough: ['clough', 'culc', 'commons'],
  'student-center': ['student center', 'john lewis', 'stucen'],
  crc: ['crc', 'rec', 'gym', 'campus recreation'],
  library: ['library', 'crosland', 'price gilbert'],
}

/** Match a search to one of the prototype's campus places. Empty search → Tech Tower. */
function findPlace(query: string): Place | undefined {
  const q = query.trim().toLowerCase()
  if (!q) return places[0]
  return places.find(
    (p) => p.name.toLowerCase().includes(q) || aliases[p.id]?.some((a) => a.startsWith(q) || q.startsWith(a)),
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [place, setPlace] = useState<Place>(places[0])
  const [routeId, setRouteId] = useState<RouteId>('safest')
  const [share, setShare] = useState<Share | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const route = useMemo(() => routesFor(place).find((r) => r.id === routeId)!, [place, routeId])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(id)
  }, [toast])

  const handleReport = (concern: string) => setToast(`Thanks! "${concern}" was reported.`)
  const handleTab = (tab: Tab) => setScreen(tab)
  const pickPlace = (p: Place) => {
    setPlace(p)
    setScreen('preview')
  }
  const arrive = useCallback(() => setScreen('arrived'), [])

  return (
    <div className="stage">
      <div className="phone">
        {screen === 'splash' && <Splash onDone={() => setScreen('home')} />}
        {screen === 'home' && (
          <Home
            onTab={handleTab}
            onReport={handleReport}
            onPickPlace={pickPlace}
            onSearch={(q) => {
              const match = findPlace(q)
              if (match) pickPlace(match)
              else setToast('Try Tech Tower, Clough, Student Center, CRC or Library.')
            }}
          />
        )}
        {(screen === 'saved' || screen === 'settings') && (
          <Placeholder tab={screen} onTab={handleTab} />
        )}
        {screen === 'preview' && (
          <RoutePreview
            place={place}
            onBack={() => setScreen('home')}
            onStart={(id, newShare) => {
              setRouteId(id)
              setShare(newShare)
              if (newShare) setToast(`Sharing your walk with ${contactNames(newShare.contactIds)}.`)
              setScreen('navigation')
            }}
          />
        )}
        {screen === 'navigation' && (
          <Navigation
            place={place}
            route={route}
            share={share}
            onShareChange={setShare}
            onReport={handleReport}
            onNotify={setToast}
            onEnd={arrive}
          />
        )}
        {screen === 'arrived' && (
          <Arrived
            destination={place.name}
            route={route}
            share={share}
            onDone={() => {
              setShare(null)
              setScreen('home')
            }}
          />
        )}
        {toast && (
          <div className="app-toast">
            <Toast>{toast}</Toast>
          </div>
        )}
      </div>
    </div>
  )
}
