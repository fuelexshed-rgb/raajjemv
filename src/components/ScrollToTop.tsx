import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * - Route changes without a hash: scroll to top (SPA default).
 * - URL with a hash (e.g. /#latest): scroll that element into view — React Router does not
 *   do this automatically for client-side navigation.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (!hash) return
    const id = hash.slice(1)
    if (!id) return
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [pathname, hash])

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      if (!id) return
      if (document.getElementById(id)) return
      const t = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)
      return () => clearTimeout(t)
    }

    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname, hash])

  return null
}
