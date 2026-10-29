import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <NavLink className="brand" to="/" aria-label="Priya Kheni, home" onClick={closeMenu}><span className="brand-mark">P<span>.</span></span><span className="brand-name">PRIYA KHENI</span></NavLink>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
        {links.map((link) => <NavLink key={link.to} end={link.to === '/'} to={link.to} className={({ isActive }) => isActive ? 'nav-link is-active' : 'nav-link'} onClick={closeMenu}>{link.label}</NavLink>)}
        <NavLink className="nav-contact" to="/contact" onClick={closeMenu}>Get in touch <span aria-hidden="true">↗</span></NavLink>
      </nav>
    </header>
  )
}

export default Header
