import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  elevated?: boolean
  block?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  elevated = false,
  block = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const cls = [
    'ww-button',
    `ww-button--${variant}`,
    `ww-button--${size}`,
    elevated && 'ww-button--elevated',
    block && 'ww-button--block',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={cls} {...rest}>
      {icon && <span className="ww-button__icon">{icon}</span>}
      {children}
    </button>
  )
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  'aria-label': string
  tone?: 'accent' | 'brand' | 'surface' | 'plain'
  /** fab: 75px floating action button · md: 48px · sm: 40px */
  size?: 'fab' | 'md' | 'sm'
  children: ReactNode
}

export function IconButton({ tone = 'accent', size = 'md', className = '', children, ...rest }: IconButtonProps) {
  return (
    <button className={`ww-icon-button ww-icon-button--${tone} ww-icon-button--${size} ${className}`.trim()} {...rest}>
      {children}
    </button>
  )
}
