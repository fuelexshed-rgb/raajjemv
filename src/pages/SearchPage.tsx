import { type FormEvent, useEffect, useId, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchPublishedArticles, type ArticleListItem } from '../lib/api'
import { ArticleCard } from '../components/ArticleCard'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = (searchParams.get('q') ?? '').trim()
  const [input, setInput] = useState(q)
  const [results, setResults] = useState<ArticleListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const labelId = useId()

  useEffect(() => {
    setInput(q)
  }, [q])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!q) {
      setResults([])
      setError(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    searchPublishedArticles(q)
      .then((rows) => {
        if (!cancelled) setResults(rows)
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(e.message)
          setResults([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [q])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next = input.trim()
    if (next) setSearchParams({ q: next })
    else setSearchParams({})
  }

  return (
    <div className="page" dir="rtl" lang="dv">
      <Header />
      <main className="search-page container">
        <nav className="breadcrumb search-breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden> / </span>
          <span className="text-muted">Search</span>
        </nav>

        <h1 className="search-page-title">Search</h1>

        <form className="search-form" onSubmit={handleSubmit} role="search">
          <label htmlFor={labelId} className="visually-hidden">
            Search articles
          </label>
          <input
            ref={inputRef}
            id={labelId}
            type="search"
            name="q"
            className="search-input"
            placeholder="Search by title or summary…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            enterKeyHint="search"
          />
          <button type="submit" className="btn-primary search-submit">
            Search
          </button>
        </form>

        {error && <p className="banner-error search-error">{error}</p>}

        {!q && !loading && (
          <p className="search-hint text-muted">Type a term and press Search to find stories.</p>
        )}

        {q && loading && <p className="search-status">Searching…</p>}

        {q && !loading && !error && results.length === 0 && (
          <p className="search-empty">No stories matched “{q}”.</p>
        )}

        {q && !loading && results.length > 0 && (
          <>
            <p className="search-count">
              {results.length} result{results.length === 1 ? '' : 's'} for “{q}”
            </p>
            <div className="grid-latest search-results">
              {results.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
