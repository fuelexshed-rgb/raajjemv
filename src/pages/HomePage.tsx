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
/** Home category block card count */
const HOME_CATEGORY_SECTION_COUNT = 4

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
    const afterMust = others.slice(mustEnd)
    const editorHero = afterMust[0] ?? null
    const afterEditorHero = editorHero ? afterMust.slice(1) : afterMust
    /**
     * Keep Editors row up to 4 items, but preserve at least one item for Popular
     * whenever there are remaining articles after the editor hero.
     */
    const editorRowCount = Math.min(
      EDITOR_ROW_LEN,
      Math.max(0, afterEditorHero.length > 0 ? afterEditorHero.length - 1 : 0),
    )
    const editorRow = afterEditorHero.slice(0, editorRowCount)
    const afterEditors = afterEditorHero.slice(editorRowCount)

    return {
      latest: others.slice(0, LATEST_COUNT),
      mustRead: others.slice(LATEST_COUNT, mustEnd),
      editorHero,
      editorRow,
      popular: afterEditors.slice(0, POPULAR_COUNT),
      mostRead: afterEditors.slice(POPULAR_COUNT, POPULAR_COUNT + MOST_READ_COUNT),
    }
  }, [others])

  const categorySections = useMemo(() => {
    if (!categories.length || !articles.length) return [] as { category: Category; items: ArticleListItem[] }[]

    return categories
      .map((category) => ({
        category,
        items: articles
          .filter((article) => article.categories?.slug === category.slug)
          .slice(0, HOME_CATEGORY_SECTION_COUNT),
      }))
      .filter((section) => section.items.length > 0)
  }, [categories, articles])

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

      {categorySections.length > 0 && (
        <section className="section" id="category-sections">
          <div className="container">
            <div className="home-category-sections-grid">
              {categorySections.map((section) => (
                <article
                  key={section.category.slug}
                  className="home-category-list-section"
                  id={`category-${section.category.slug}`}
                >
                  <div className="section-head">
                    <h2 className="section-title dhivehi-inline">{section.category.name}</h2>
                    <Link to={`/category/${section.category.slug}`} className="see-all">
                      See all
                    </Link>
                  </div>
                  <div className="home-category-list">
                    {section.items.map((a, index) => (
                      <Link key={a.id} to={`/article/${a.slug}`} className="home-category-list-item">
                        <span className="home-category-list-rank">{index + 1}</span>
                        <img
                          src={a.featured_image_url || '/placeholder-news.svg'}
                          alt=""
                          className="home-category-list-thumb"
                          loading="lazy"
                        />
                        <div className="home-category-list-copy">
                          <h3 className="home-category-list-title">{a.title}</h3>
                          <p className="home-category-list-meta">
                            {a.author_name} · {formatDate(a.published_at)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </article>
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
