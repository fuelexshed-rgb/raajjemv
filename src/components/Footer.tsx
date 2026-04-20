import { Link } from 'react-router-dom'

type FooterLink = { label: string; to: string; className?: string }
type SocialLink = { label: string; href: string; icon: JSX.Element }

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

const socialLinks: SocialLink[] = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M14.5 8H17V4h-2.5C11.7 4 10 5.7 10 8.5V11H7v4h3v5h4v-5h3l1-4h-4V8.8c0-.5.3-.8.5-.8Z" />
      </svg>
    ),
  },
  {
    label: 'X',
    href: 'https://x.com/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M18.9 3H21l-6.9 7.9L22 21h-6.1l-4.8-6.3L5.6 21H3.5l7.4-8.5L2 3h6.2l4.4 5.9L18.9 3Zm-1.1 16h1.7L7.3 4.9H5.5L17.8 19Z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm11.25 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M22 12c0-3.3-.3-5.2-.9-6.3a3.5 3.5 0 0 0-2.5-1.7C17.4 3.7 15.2 3.5 12 3.5S6.6 3.7 5.4 4a3.5 3.5 0 0 0-2.5 1.7C2.3 6.8 2 8.7 2 12s.3 5.2.9 6.3a3.5 3.5 0 0 0 2.5 1.7c1.2.3 3.4.5 6.6.5s5.4-.2 6.6-.5a3.5 3.5 0 0 0 2.5-1.7c.6-1.1.9-3 .9-6.3Zm-12.5 3.7V8.3L16 12l-6.5 3.7Z" />
      </svg>
    ),
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
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="social-link"
                aria-label={social.label}
                target="_blank"
                rel="noreferrer"
              >
                {social.icon}
              </a>
            ))}
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
