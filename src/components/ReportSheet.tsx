import type { ReactNode } from 'react'
import { BottomSheet, OptionGrid, OptionTile } from '../design-system'

const PersonIcon = (
  <span className="person-icon">
    <span className="person-icon__fill">
      <img src="/assets/person-fill.svg" alt="" />
    </span>
    <span className="person-icon__outline">
      <img src="/assets/person-outline.svg" alt="" />
    </span>
  </span>
)

const concerns: { label: string; icon: ReactNode }[] = [
  { label: 'Construction', icon: <img src="/assets/construction.svg" alt="" width={44} height={44} /> },
  { label: 'Poor Lighting', icon: <img src="/assets/light-bulb.svg" alt="" width={44} height={44} /> },
  {
    label: 'No Crosswalk Signal',
    icon: (
      <span className="no-ped">
        <img src="/assets/no-pedestrians.svg" alt="" width={38.5} height={38.5} />
      </span>
    ),
  },
  { label: 'Suspicious person', icon: PersonIcon },
]

export default function ReportSheet({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (concern: string) => void
}) {
  return (
    <BottomSheet className="app-sheet" title="Report a safety concern" onClose={onClose}>
      <OptionGrid>
        {concerns.map((c) => (
          <OptionTile key={c.label} label={c.label} icon={c.icon} onClick={() => onSubmit(c.label)} />
        ))}
      </OptionGrid>
    </BottomSheet>
  )
}
