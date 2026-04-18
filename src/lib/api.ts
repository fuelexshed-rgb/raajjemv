import { supabase } from './supabase'

function normalizeCategory(
  raw: unknown,
): { name: string; slug: string } | null {
  if (!raw) return null
  if (Array.isArray(raw)) {
    const first = raw[0]
    if (first && typeof first === 'object' && 'name' in first) {
      return first as { name: string; slug: string }
    }
    return null
  }
  if (typeof raw === 'object' && raw !== null && 'name' in raw) {
    return raw as { name: string; slug: string }
  }
  return null
}

export type ArticleListItem = {
  id: string
  title: string
  slug: string
  summary: string | null
  featured_image_url: string | null
  published_at: string
  user_id: string
  author_name: string
  categories: { name: string; slug: string } | null
}

export type ArticleDetail = ArticleListItem & {
  body_html: string | null
}

export type Category = { name: string; slug: string }

async function attachAuthors<T extends { user_id: string }>(rows: T[]): Promise<(T & { author_name: string })[]> {
  if (!rows.length) return []
  const userIds = [...new Set(rows.map((r) => r.user_id))]
  const { data: profs, error } = await supabase.from('profiles').select('id, author_name').in('id', userIds)
  if (error) throw error
  const map = new Map((profs ?? []).map((p) => [p.id, p.author_name?.trim() || 'Editor']))
  return rows.map((r) => ({
    ...r,
    author_name: map.get(r.user_id) ?? 'Editor',
  }))
}

export async function fetchPublishedList(): Promise<ArticleListItem[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, summary, featured_image_url, published_at, user_id, categories(name, slug)')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })

  if (error) throw error
  const rows = (data ?? []).map((row: Record<string, unknown>) => ({
    ...row,
    categories: normalizeCategory(row.categories),
  })) as Omit<ArticleListItem, 'author_name'>[]
  return attachAuthors(rows) as Promise<ArticleListItem[]>
}

/** Names and slugs from `categories`, or derived from published articles if the table is empty. */
export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('name, slug').order('name')
  if (!error && data && data.length > 0) {
    return data as Category[]
  }
  const articles = await fetchPublishedList()
  const map = new Map<string, Category>()
  for (const a of articles) {
    if (a.categories?.slug && a.categories?.name) {
      map.set(a.categories.slug, { name: a.categories.name, slug: a.categories.slug })
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export async function fetchPublishedByCategorySlug(slug: string): Promise<ArticleListItem[]> {
  const articles = await fetchPublishedList()
  return articles.filter((a) => a.categories?.slug === slug)
}

/** Case-insensitive search on title and summary (published articles only). */
export async function searchPublishedArticles(query: string): Promise<ArticleListItem[]> {
  const raw = query.trim().slice(0, 120)
  if (!raw) return []
  // Avoid breaking PostgREST .or() / ilike patterns
  const safe = raw.replace(/[%*,()]/g, '').trim()
  if (!safe) return []

  const pattern = `%${safe}%`
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, summary, featured_image_url, published_at, user_id, categories(name, slug)')
    .not('published_at', 'is', null)
    .or(`title.ilike.${pattern},summary.ilike.${pattern}`)
    .order('published_at', { ascending: false })
    .limit(60)

  if (error) throw error
  const rows = (data ?? []).map((row: Record<string, unknown>) => ({
    ...row,
    categories: normalizeCategory(row.categories),
  })) as Omit<ArticleListItem, 'author_name'>[]
  return attachAuthors(rows) as Promise<ArticleListItem[]>
}

export async function fetchArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, summary, body_html, featured_image_url, published_at, user_id, categories(name, slug)')
    .eq('slug', slug)
    .not('published_at', 'is', null)
    .maybeSingle()

  if (error) throw error
  if (!data) return null
  const row = {
    ...data,
    categories: normalizeCategory((data as Record<string, unknown>).categories),
  } as Omit<ArticleDetail, 'author_name'>
  const [withAuthor] = await attachAuthors([row])
  return withAuthor as ArticleDetail
}
