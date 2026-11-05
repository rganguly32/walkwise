import AppTabBar, { type Tab } from '../components/TabBar'

const copy: Record<'saved' | 'settings', string> = {
  saved: 'Saved routes will appear here.',
  settings: 'Settings are coming soon.',
}

export default function Placeholder({
  tab,
  onTab,
}: {
  tab: 'saved' | 'settings'
  onTab: (tab: Tab) => void
}) {
  return (
    <div className="screen placeholder">
      <h1 className="placeholder__title ww-text-display">{tab === 'saved' ? 'Saved' : 'Settings'}</h1>
      <p className="ww-text-body placeholder__body">{copy[tab]}</p>
      <AppTabBar active={tab} onTab={onTab} />
    </div>
  )
}
