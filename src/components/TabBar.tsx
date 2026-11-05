import { TabBar, type TabItem } from '../design-system'

export type Tab = 'home' | 'saved' | 'settings'

const tabs: TabItem<Tab>[] = [
  { id: 'home', label: 'Home', icon: '/assets/map.svg', iconSize: 42 },
  { id: 'saved', label: 'Saved', icon: '/assets/bookmark.svg' },
  { id: 'settings', label: 'Settings', icon: '/assets/settings.svg' },
]

export default function AppTabBar({ active, onTab }: { active: Tab; onTab: (tab: Tab) => void }) {
  return <TabBar className="app-tabbar" items={tabs} active={active} onChange={onTab} />
}
