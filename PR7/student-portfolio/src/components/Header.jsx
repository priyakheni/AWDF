import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../auth/useAuth.js'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const closeMenu = () => setMenuOpen(false)

  function handleLogout() {
    logout()
    closeMenu()
    navigate('/login', { replace: true })
  }

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Priya Kheni, home" onClick={closeMenu}><span className="brand-mark">P<span>.</span></span><span className="brand-name">PRIYA KHENI</span></Link>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
        <NavLink end to="/" className={({ isActive }) => isActive ? 'nav-link is-active' : 'nav-link'} onClick={closeMenu}>Home</NavLink>
        <NavLink to="/projects" className={({ isActive }) => isActive ? 'nav-link is-active' : 'nav-link'} onClick={closeMenu}>Tasks</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link is-active' : 'nav-link'} onClick={closeMenu}>Contact</NavLink>
        {user ? <><span className="nav-user-email">{user.email}</span><button className="nav-contact nav-logout" type="button" onClick={handleLogout}>Sign out <span aria-hidden="true">↗</span></button></> : <NavLink className="nav-contact" to="/login" onClick={closeMenu}>Sign in <span aria-hidden="true">↗</span></NavLink>}
      </nav>
    </header>
  )
}

export default Header
