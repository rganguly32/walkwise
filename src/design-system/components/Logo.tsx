type LogoProps = {
  /** wordmark: "Walk [shield] Wise" · mark: shield only · icon: app icon */
  variant?: 'wordmark' | 'mark' | 'icon'
  /** onDark for navy backgrounds, onLight for white backgrounds */
  tone?: 'onDark' | 'onLight'
  width: number
  className?: string
}

/**
 * Brand rules: use the white wordmark on navy and the color wordmark on white.
 * Never recolor, stretch or re-type the logo; Candara is logotype-only.
 */
export function Logo({ variant = 'wordmark', tone = 'onDark', width, className = '' }: LogoProps) {
  const cls = `ww-logo ww-logo--${variant} ww-logo--${tone} ${className}`.trim()

  if (variant === 'icon') {
    return <img className={cls} src="/brand/app-icon.png" alt="WalkWise" width={width} height={width} />
  }

  if (variant === 'wordmark' && tone === 'onDark') {
    return <img className={cls} src="/brand/wordmark-white.png" alt="WalkWise" style={{ width }} />
  }

  if (variant === 'mark' && tone === 'onDark') {
    return <img className={cls} src="/brand/shield-on-navy.png" alt="WalkWise" style={{ width }} />
  }

  // Color logo artwork ships on a square canvas; crop to the artwork with CSS.
  return (
    <span className={cls} style={{ width }} role="img" aria-label="WalkWise">
      <img src="/brand/logo-color.png" alt="" />
    </span>
  )
}
