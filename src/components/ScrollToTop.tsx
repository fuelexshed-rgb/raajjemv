import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scroll window to top on every client-side navigation (fixes SPA scroll position on mobile/desktop). */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])

  return null
}
