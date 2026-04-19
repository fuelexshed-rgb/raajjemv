import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCategories, fetchPublishedList, type ArticleListItem, type Category } from '../lib/api'
import { ArticleCard } from '../components/ArticleCard'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { formatDate } from '../lib/formatDate'

/** Top stories shown in ފަހުގެ ހަބަރު (latest) */
const LATEST_COUNT = 8
/** މުހިންމު ހަބަރު */
const MUST_READ_COUNT = 6
/** ޕޮޕިޔުލޭރު — next chronological window after latest + must-read */
const POPULAR_COUNT = 6
/** ގިނައިން ކިޔާފައިވާ — following window (no view analytics; distinct feed slice) */
const MOST_READ_COUNT = 6

export function HomePage() {
  const [articles, setArticles] = useState<ArticleListItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPublishedList()
      .then(setArticles)
      .catch((e: Error) => setError(e.message))
  }, [])

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  const { hero, others } = useMemo(() => {
    if (!articles.length) return { hero: null as ArticleListItem | null, others: [] as ArticleListItem[] }
    const idx = articles.findIndex((a) => a.featured_image_url)
    const fi = idx === -1 ? 0 : idx
    const h = articles[fi]
    const o = articles.filter((_, i) => i !== fi)
    return { hero: h, others: o }
  }, [articles])

  const EDITOR_ROW_LEN = 4

  const { latest, mustRead, popular, mostRead, editorHero, editorRow } = useMemo(() => {
    if (!others.length) {
      return {
        latest: [] as ArticleListItem[],
        mustRead: [] as ArticleListItem[],
        popular: [] as ArticleListItem[],
        mostRead: [] as ArticleListItem[],
        editorHero: null as ArticleListItem | null,
        editorRow: [] as ArticleListItem[],
      }
    }
    const mustEnd = LATEST_COUNT + MUST_READ_COUNT
    /** Hero + sub-row come right after latest + must-read (same as before extra sections). */
    const editorStart = mustEnd
    const afterEditors = editorStart + 1 + EDITOR_ROW_LEN

    return {
      latest: others.slice(0, LATEST_COUNT),
      mustRead: others.slice(LATEST_COUNT, mustEnd),
      editorHero: others[editorStart] ?? null,
      editorRow: others.slice(editorStart + 1, editorStart + 1 + EDITOR_ROW_LEN),
      popular: others.slice(afterEditors, afterEditors + POPULAR_COUNT),
      mostRead: others.slice(afterEditors + POPULAR_COUNT, afterEditors + POPULAR_COUNT + MOST_READ_COUNT),
    }
  }, [others])

  return (
    <div className="page" dir="rtl" lang="dv">
      <Header />

      <section className="hero-welcome">
        <div className="container">
          <p className="welcome-kicker">Welcome to RaajjeMV</p>
          <h1 className="welcome-title">
            Craft narratives that ignite <em>inspiration</em>, <em>knowledge</em>, and{' '}
            <em>entertainment</em>.
          </h1>
        </div>
      </section>

      {error && (
        <div className="container banner-error">
          <p>{error}</p>
          <p className="text-muted small">Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in <code>.env</code>.</p>
        </div>
      )}

      {!error && articles.length === 0 && (
        <div className="container empty-state">
          <p>No published stories yet. Publish articles from your CMS to see them here.</p>
        </div>
      )}

      {hero && (
        <section className="section featured-section">
          <div className="container">
            <Link to={`/article/${hero.slug}`} className="featured-block">
              <div className="featured-img-col">
                <img
                  src={hero.featured_image_url || '/placeholder-news.svg'}
                  alt=""
                  className="featured-img"
                />
              </div>
              <div className="featured-text-col">
                {hero.categories?.name && <span className="cat-pill">{hero.categories.name}</span>}
                <h2 className="featured-headline">{hero.title}</h2>
                {hero.summary && <p className="featured-excerpt">{hero.summary}</p>}
                <p className="news-card-meta">
                  {hero.author_name} · {formatDate(hero.published_at)}
                </p>
              </div>
            </Link>
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section className="section" id="latest">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title dhivehi-inline">ފަހުގެ ހަބަރު</h2>
              <Link to="/#latest" className="see-all">
                See all
              </Link>
            </div>
            <div className="grid-latest">
              {latest.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {mustRead.length > 0 && (
        <section className="section section-muted" id="must-read">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title dhivehi-inline">މުހިންމު ހަބަރު</h2>
              <Link to="/#must-read" className="see-all">
                See all
              </Link>
            </div>
            <div className={`must-grid must-count-${mustRead.length}`}>
              {mustRead.map((a) => (
                <ArticleCard key={a.id} article={a} className="card-compact" />
              ))}
            </div>
          </div>
        </section>
      )}

      {(editorHero || editorRow.length > 0) && (
        <section className="section" id="editors">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title dhivehi-inline">ފާހަގަކޮށްލެވޭ ހަބަރު</h2>
              <Link to="/#editors" className="see-all">
                See all
              </Link>
            </div>
            {editorHero && (
              <Link to={`/article/${editorHero.slug}`} className="editor-hero">
                <img
                  src={editorHero.featured_image_url || '/placeholder-news.svg'}
                  alt=""
                  className="editor-hero-img"
                />
                <div className="editor-hero-gradient" />
                <div className="editor-hero-text">
                  {editorHero.categories?.name && (
                    <span className="cat-pill cat-pill-on-dark">{editorHero.categories.name}</span>
                  )}
                  <h3>{editorHero.title}</h3>
                  {editorHero.summary && <p>{editorHero.summary}</p>}
                </div>
              </Link>
            )}
            {editorRow.length > 0 && (
              <div className="grid-editors-sub">
                {editorRow.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="section home-categories-section" id="categories">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title dhivehi-inline">ކެޓަގަރީތައް</h2>
              <Link to="/#categories" className="see-all">
                Browse
              </Link>
            </div>
            <div className="home-categories-grid" role="navigation" aria-label="Categories">
              {categories.map((c) => (
                <Link key={c.slug} to={`/category/${c.slug}`} className="home-category-pill">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {popular.length > 0 && (
        <section className="section section-muted" id="popular">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title dhivehi-inline">ޕޮޕިޔުލޭރު</h2>
              <Link to="/#popular" className="see-all">
                See all
              </Link>
            </div>
            <div className="grid-latest">
              {popular.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {mostRead.length > 0 && (
        <section className="section" id="most-read">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title dhivehi-inline">ގިނައިން ކިޔާފައިވާ</h2>
              <Link to="/#most-read" className="see-all">
                See all
              </Link>
            </div>
            <div className="grid-latest">
              {mostRead.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="newsletter" id="newsletter">
        <div className="container newsletter-inner">
          <div>
            <p className="newsletter-kicker">Get first update</p>
            <p className="newsletter-copy">
              Get the news on the front line by subscribing to our latest updates.
            </p>
          </div>
          <form
            className="newsletter-form"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <input type="email" placeholder="Email address" className="newsletter-input" aria-label="Email" />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
