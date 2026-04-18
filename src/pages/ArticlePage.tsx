import DOMPurify from 'dompurify'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchArticleBySlug, fetchPublishedList, type ArticleDetail, type ArticleListItem } from '../lib/api'
import { ArticleCard } from '../components/ArticleCard'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'

const MORE_ARTICLE_COUNT = 8

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<ArticleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [moreArticles, setMoreArticles] = useState<ArticleListItem[]>([])

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      setError('Missing article link')
      return
    }
    setLoading(true)
    setError(null)
    setArticle(null)
    fetchArticleBySlug(slug)
      .then((a) => setArticle(a))
      .catch((e: Error) => {
        setError(e.message)
        setArticle(null)
      })
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!slug) {
      setMoreArticles([])
      return
    }
    fetchPublishedList()
      .then((list) => {
        const others = list.filter((a) => a.slug !== slug).slice(0, MORE_ARTICLE_COUNT)
        setMoreArticles(others)
      })
      .catch(() => setMoreArticles([]))
  }, [slug])

  if (loading) {
    return (
      <div className="page" dir="rtl" lang="dv">
        <Header />
        <div className="container article-loading">Loading…</div>
        <Footer />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="page" dir="rtl" lang="dv">
        <Header />
        <div className="container article-loading">
          <p>{error ?? 'Article not found.'}</p>
          <Link to="/">← Home</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const safe = DOMPurify.sanitize(article.body_html || '', {
    ADD_ATTR: ['target', 'rel'],
    // Strip inline styles, embedded <style> blocks, and legacy color attrs (CMS often ships grey text this way)
    FORBID_ATTR: ['style', 'color', 'bgcolor', 'face'],
    FORBID_TAGS: ['font', 'style'],
  })

  return (
    <div className="page" dir="rtl" lang="dv">
      <Header />
      <article className="article-page container" dir="rtl" lang="dv">
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden> / </span>
          {article.categories?.name && (
            <>
              <span>{article.categories.name}</span>
              <span aria-hidden> / </span>
            </>
          )}
          <span className="text-muted">{article.title}</span>
        </nav>

        {article.categories?.name && <span className="cat-pill">{article.categories.name}</span>}
        <h1 className="article-title">{article.title}</h1>
        <p className="article-byline">
          <span className="dhivehi-inline">{article.author_name}</span>
          <span className="text-muted"> · {formatDate(article.published_at)}</span>
        </p>

        {article.featured_image_url && (
          <div className="article-hero-img-wrap">
            <img src={article.featured_image_url} alt="" className="article-hero-img" />
          </div>
        )}

        {article.summary && <p className="article-lead">{article.summary}</p>}

        <div
          className="article-body dhivehi-body"
          dir="rtl"
          dangerouslySetInnerHTML={{ __html: safe }}
        />
      </article>

      {moreArticles.length > 0 && (
        <section className="section article-more-section" aria-labelledby="article-more-heading">
          <div className="container">
            <div className="section-head">
              <h2 id="article-more-heading" className="section-title dhivehi-inline">
                ފަހުގެ ހަބަރު
              </h2>
              <Link to="/#latest" className="see-all">
                See all
              </Link>
            </div>
            <div className="grid-latest">
              {moreArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
