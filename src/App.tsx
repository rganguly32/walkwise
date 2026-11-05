import { useEffect, useState } from 'react'
import { Toast } from './design-system'
import Splash from './screens/Splash'
import Home from './screens/Home'
import Navigation from './screens/Navigation'
import Placeholder from './screens/Placeholder'
import type { Tab } from './components/TabBar'

type Screen = 'splash' | 'home' | 'saved' | 'settings' | 'navigation'

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [destination, setDestination] = useState('')
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
              setScreen('navigation')
            }}
          />
        )}
        {(screen === 'saved' || screen === 'settings') && (
          <Placeholder tab={screen} onTab={handleTab} />
        )}
        {screen === 'navigation' && (
          <Navigation
            destination={destination}
            onReport={handleReport}
            onEnd={() => setScreen('home')}
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
