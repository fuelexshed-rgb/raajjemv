import { Link } from 'react-router-dom'

type FooterLink = { label: string; to: string; className?: string }

const cols: { title: string; links: FooterLink[] }[] = [
  {
    title: 'News',
    links: [
      { label: 'ފަހުގެ ހަބަރު', to: '/#latest', className: 'dhivehi-inline' },
      { label: 'މުހިންމު ހަބަރު', to: '/#must-read', className: 'dhivehi-inline' },
    ],
  },
  {
    title: 'Discover',
    links: [
      { label: 'ކެޓަގަރީތައް', to: '/#categories', className: 'dhivehi-inline' },
      { label: 'ޕޮޕިޔުލޭރު', to: '/#popular', className: 'dhivehi-inline' },
      { label: 'ގިނައިން ކިޔާފައިވާ', to: '/#most-read', className: 'dhivehi-inline' },
      { label: 'ފާހަގަކޮށްލެވޭ ހަބަރު', to: '/#editors', className: 'dhivehi-inline' },
      { label: 'Stories', to: '/#latest' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/' },
      { label: 'Contact', to: '/' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="logo footer-logo">
            Raajje<span className="logo-accent">MV</span>
          </Link>
          <p className="footer-tagline">
            Maldives news — stories that inform, inspire, and connect our islands.
          </p>
          <div className="social-row" aria-label="Social">
            <a href="#" className="social-dot" aria-label="Facebook" />
            <a href="#" className="social-dot" aria-label="Twitter" />
            <a href="#" className="social-dot" aria-label="Instagram" />
            <a href="#" className="social-dot" aria-label="YouTube" />
          </div>
        </div>
        {cols.map((col) => (
          <div key={col.title} className="footer-col">
            <h3 className="footer-heading">{col.title}</h3>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className={l.className}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} RaajjeMV. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
