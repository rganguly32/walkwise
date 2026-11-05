export type TabItem<T extends string> = {
  id: T
  label: string
  icon: string
  iconSize?: number
}

type TabBarProps<T extends string> = {
  items: TabItem<T>[]
  active: T
  onChange: (id: T) => void
  className?: string
}

export function TabBar<T extends string>({ items, active, onChange, className = '' }: TabBarProps<T>) {
  return (
    <nav className={`ww-tabbar ${className}`.trim()}>
      <div className="ww-tabbar__row">
        {items.map((t) => (
          <button
            key={t.id}
            className={`ww-tabbar__item${active === t.id ? ' is-active' : ''}`}
            onClick={() => onChange(t.id)}
            aria-current={active === t.id ? 'page' : undefined}
          >
            <img src={t.icon} alt="" width={t.iconSize ?? 44} height={t.iconSize ?? 44} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
