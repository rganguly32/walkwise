import { useEffect, useState } from 'react'
import { Toast } from './design-system'
import Splash from './screens/Splash'
import Home from './screens/Home'
import RoutePreview from './screens/RoutePreview'
import Navigation from './screens/Navigation'
import Arrived from './screens/Arrived'
import Placeholder from './screens/Placeholder'
import type { Tab } from './components/TabBar'
import { contactNames, type RouteId, type Share } from './data/walk'

type Screen = 'splash' | 'home' | 'saved' | 'settings' | 'preview' | 'navigation' | 'arrived'

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [destination, setDestination] = useState('')
  const [routeId, setRouteId] = useState<RouteId>('safest')
  const [share, setShare] = useState<Share | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(id)
  }, [toast])

  const handleReport = (concern: string) => setToast(`Thanks! "${concern}" was reported.`)
  const handleTab = (tab: Tab) => setScreen(tab)

  return (
    <div className="stage">
      <div className="phone">
        {screen === 'splash' && <Splash onDone={() => setScreen('home')} />}
        {screen === 'home' && (
          <Home
            onTab={handleTab}
            onReport={handleReport}
            onSearch={(q) => {
              setDestination(q)
              setScreen('preview')
            }}
          />
        )}
        {(screen === 'saved' || screen === 'settings') && (
          <Placeholder tab={screen} onTab={handleTab} />
        )}
        {screen === 'preview' && (
          <RoutePreview
            destination={destination}
            onBack={() => setScreen('home')}
            onStart={(route, newShare) => {
              setRouteId(route)
              setShare(newShare)
              if (newShare) setToast(`Sharing your walk with ${contactNames(newShare.contactIds)}.`)
              setScreen('navigation')
            }}
          />
        )}
        {screen === 'navigation' && (
          <Navigation
            share={share}
            onShareChange={setShare}
            onReport={handleReport}
            onNotify={setToast}
            onEnd={() => setScreen('arrived')}
          />
        )}
        {screen === 'arrived' && (
          <Arrived
            destination={destination}
            routeId={routeId}
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
