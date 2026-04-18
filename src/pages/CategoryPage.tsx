import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchCategories, fetchPublishedByCategorySlug, type ArticleListItem } from '../lib/api'
import { ArticleCard } from '../components/ArticleCard'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [articles, setArticles] = useState<ArticleListItem[]>([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setError(null)
    Promise.all([fetchPublishedByCategorySlug(slug), fetchCategories()])
      .then(([list, cats]) => {
        setArticles(list)
        const label = cats.find((c) => c.slug === slug)?.name ?? list[0]?.categories?.name ?? slug
        setTitle(label)
      })
      .catch((e: Error) => setError(e.message))
  }, [slug])

  return (
    <div className="page" dir="rtl" lang="dv">
      <Header />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h1 className="section-title">{title || slug}</h1>
            <Link to="/" className="see-all">
              Home
            </Link>
          </div>

          {error && (
            <div className="banner-error">
              <p>{error}</p>
            </div>
          )}

          {!error && articles.length === 0 && slug && (
            <p className="text-muted">No published stories in this category yet.</p>
          )}

          {articles.length > 0 && (
            <div className="grid-latest">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
