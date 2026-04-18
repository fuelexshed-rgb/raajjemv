import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { fetchCategories, fetchPublishedList, type Category } from '../lib/api'

const cmsUrl = import.meta.env.VITE_CMS_URL

/** Ticker duration scales with how many stories so long lists stay readable */
function bannerTickerDurationSec(count: number): number {
  if (count <= 0) return 34
  return Math.min(130, Math.max(34, Math.round(count * 2.35)))
}

export function Header() {
  const [categories, setCategories] = useState<Category[]>([])
  const [headlines, setHeadlines] = useState<{ title: string; slug: string }[]>([])

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
                <NavLink key={c.slug} to={`/category/${c.slug}`} className="nav-main-link">
                  {c.name}
                </NavLink>
              ))
            ) : (
              <Link to="/#latest" className="nav-main-link">
                Latest
              </Link>
            )}
          </nav>
          <div className="header-actions">
            <Link to="/search" className="icon-btn" aria-label="Search articles">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </Link>
            <a
              className="icon-btn"
              href={cmsUrl || '#'}
              target={cmsUrl ? '_blank' : undefined}
              rel={cmsUrl ? 'noopener noreferrer' : undefined}
              title={cmsUrl ? 'Open CMS' : 'Set VITE_CMS_URL in .env'}
              aria-label="Open CMS"
              onClick={(e) => {
                if (!cmsUrl) e.preventDefault()
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </a>
            <span className="avatar-placeholder" aria-hidden />
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
