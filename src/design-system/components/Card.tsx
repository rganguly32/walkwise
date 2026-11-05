import type { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** brand: navy · accent: red · surface: white */
  tone?: 'brand' | 'accent' | 'surface'
  elevation?: 'none' | 'sm' | 'lg'
  as?: 'div' | 'header' | 'section'
}

export function Card({ tone = 'surface', elevation = 'none', as: Tag = 'div', className = '', ...rest }: CardProps) {
  return <Tag className={`ww-card ww-card--${tone} ww-card--shadow-${elevation} ${className}`.trim()} {...rest} />
}
