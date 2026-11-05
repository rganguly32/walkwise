import { IconButton } from '../design-system'

export default function ReportButton({ top, onClick }: { top: number; onClick: () => void }) {
  return (
    <IconButton className="report-fab" style={{ top }} size="fab" tone="accent" onClick={onClick} aria-label="Report a safety concern">
      <img src="/assets/report-problem.svg" alt="" />
    </IconButton>
  )
}
