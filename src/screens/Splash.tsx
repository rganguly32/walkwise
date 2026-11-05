import { useEffect } from 'react'
import { Logo } from '../design-system'

export default function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, 1800)
    return () => clearTimeout(id)
  }, [onDone])

  return (
    <button className="splash" onClick={onDone} aria-label="Enter WalkWise">
      <Logo variant="wordmark" tone="onDark" width={335} />
    </button>
  )
}
