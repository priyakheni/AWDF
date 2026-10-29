import { useState } from 'react'

function Header({ navigation, activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Priya Kheni, home"><span className="brand-mark">P<span>.</span></span><span className="brand-name">PRIYA KHENI</span></a>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
        {navigation.map((item) => <a key={item.href} className={activeSection === item.href.slice(1) ? 'nav-link is-active' : 'nav-link'} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
        <a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>Get in touch <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  )
}

export default Header
