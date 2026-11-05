import { useState, type FormEvent } from 'react'

type SearchFieldProps = {
  placeholder?: string
  label?: string
  onSubmit: (query: string) => void
  className?: string
}

export function SearchField({ placeholder = 'Search', label = 'Search', onSubmit, className = '' }: SearchFieldProps) {
  const [query, setQuery] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(query.trim())
  }

  return (
    <form className={`ww-search ${className}`.trim()} onSubmit={submit} role="search">
      <input
        className="ww-search__input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label={label}
      />
      <button className="ww-search__btn" type="submit" aria-label="Search">
        <img src="/assets/search.svg" alt="" />
      </button>
    </form>
  )
}
