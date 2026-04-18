import { Link } from 'react-router-dom'
import type { ArticleListItem } from '../lib/api'
import { formatDate } from '../lib/formatDate'

export function ArticleCard({
  article,
  className = '',
}: {
  article: ArticleListItem
  className?: string
}) {
  const img = article.featured_image_url || '/placeholder-news.svg'
  return (
    <Link to={`/article/${article.slug}`} className={`news-card ${className}`}>
      <div className="news-card-img-wrap">
        <img src={img} alt="" className="news-card-img" loading="lazy" />
      </div>
      <div className="news-card-body">
        {article.categories?.name && <span className="cat-pill">{article.categories.name}</span>}
        <h3 className="news-card-title">{article.title}</h3>
        {article.summary && <p className="news-card-excerpt">{article.summary}</p>}
        <p className="news-card-meta">
          {article.author_name} · {formatDate(article.published_at)}
        </p>
      </div>
    </Link>
  )
}
