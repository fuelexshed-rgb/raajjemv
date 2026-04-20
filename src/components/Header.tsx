import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { fetchCategories, fetchPublishedList, type Category } from '../lib/api'

/** Ticker duration scales with how many stories so long lists stay readable */
function bannerTickerDurationSec(count: number): number {
  if (count <= 0) return 55
  return Math.min(180, Math.max(55, Math.round(count * 3.2)))
}

export function Header() {
  const [categories, setCategories] = useState<Category[]>([])
  const [headlines, setHeadlines] = useState<{ title: string; slug: string }[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    fetchPublishedList()
      .then((articles) => {
        setHeadlines(articles.map((a) => ({ title: a.title, slug: a.slug })))
      })
      .catch(() => setHeadlines([]))
  }, [])

  const bannerAriaLabel = useMemo(() => {
    if (!headlines.length) return 'Latest news'
    const sample = headlines
      .slice(0, 3)
      .map((h) => h.title)
      .join('; ')
    const more = headlines.length > 3 ? ` and ${headlines.length - 3} more` : ''
    return `Latest news, ${headlines.length} stories: ${sample}${more}`
  }, [headlines])

  useEffect(() => {
    if (!searchOpen) return
    searchInputRef.current?.focus()
  }, [searchOpen])

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault()
    const next = searchInput.trim()
    if (!next) return
    navigate(`/search?q=${encodeURIComponent(next)}`)
    setSearchOpen(false)
  }

  return (
    <header className="site-header">
      <div className="site-header-top">
        <div className="container header-inner">
          <Link to="/" className="logo">
            Raajje<span className="logo-accent">MV</span>
          </Link>
          <nav className="nav-main" aria-label="Primary">
            {categories.length > 0 ? (
              categories.map((c) => (
                <NavLink
                  key={c.slug}
                  to={`/category/${c.slug}`}
                  className={({ isActive }) =>
                    `nav-main-link home-category-pill${isActive ? ' active' : ''}`
                  }
                >
                  {c.name}
                </NavLink>
              ))
            ) : (
              <Link to="/#latest" className="nav-main-link home-category-pill">
                Latest
              </Link>
            )}
          </nav>
          <div className="header-actions">
            <form className={`header-search${searchOpen ? ' is-open' : ''}`} onSubmit={handleSearchSubmit} role="search">
              <label htmlFor="header-search-input" className="visually-hidden">
                Search articles
              </label>
              <input
                ref={searchInputRef}
                id="header-search-input"
                type="search"
                className="header-search-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="ހޯދާ"
                autoComplete="off"
                enterKeyHint="search"
              />
              <button
                type="button"
                className="icon-btn header-search-toggle"
                aria-label="Search articles"
                aria-expanded={searchOpen}
                onClick={() => {
                  if (!searchOpen) {
                    setSearchOpen(true)
                    return
                  }
                  const next = searchInput.trim()
                  if (!next) return
                  navigate(`/search?q=${encodeURIComponent(next)}`)
                  setSearchOpen(false)
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="latest-news-banner" role="region" aria-label={bannerAriaLabel}>
        <div className="container latest-news-banner-inner">
          {headlines.length > 0 ? (
            <div className="latest-news-banner-content">
              <span className="latest-news-banner-kicker" dir="rtl" lang="dv">
                ފަހުގެ ހަބަރު
              </span>
              <div className="latest-news-banner-marquee">
                <div
                  className="latest-news-banner-track"
                  style={
                    {
                      '--banner-ticker-dur': `${bannerTickerDurationSec(headlines.length)}s`,
                    } as CSSProperties
                  }
                >
                  <div className="latest-news-banner-ticker-chunk">
                    {headlines.map((h, i) => (
                      <span key={`a-${h.slug}-${i}`} className="latest-news-banner-ticker-item">
                        <Link
                          to={`/article/${h.slug}`}
                          className="latest-news-banner-ticker-link"
                          dir="rtl"
                          lang="dv"
                        >
                          {h.title}
                        </Link>
                      </span>
                    ))}
                  </div>
                  <div className="latest-news-banner-ticker-chunk" aria-hidden>
                    {headlines.map((h, i) => (
                      <span key={`b-${h.slug}-${i}`} className="latest-news-banner-ticker-item">
                        <span className="latest-news-banner-ticker-mirror" dir="rtl" lang="dv">
                          {h.title}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/#latest"
              className="latest-news-banner-link latest-news-banner-link--static"
              aria-label="Latest news: view all stories"
            >
              <span className="latest-news-banner-kicker" dir="rtl" lang="dv">
                ފަހުގެ ހަބަރު
              </span>
              <span className="latest-news-banner-title">View all stories</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
