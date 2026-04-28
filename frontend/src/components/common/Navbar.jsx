import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

const TruckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect width="17" height="12" x="2" y="9" rx="2" fill="url(#ng)" />
    <path d="M19 11h4l3 5v4h-7V11z" fill="url(#ng2)" />
    <circle cx="7"  cy="22" r="2.5" fill="#fff" />
    <circle cx="21" cy="22" r="2.5" fill="#fff" />
    <defs>
      <linearGradient id="ng" x1="0" y1="0" x2="1" y2="0">
        <stop stopColor="#FF6B2B"/><stop offset="1" stopColor="#FFB800"/>
      </linearGradient>
      <linearGradient id="ng2" x1="0" y1="0" x2="1" y2="0">
        <stop stopColor="#FFB800"/><stop offset="1" stopColor="#FF6B2B"/>
      </linearGradient>
    </defs>
  </svg>
)

const navLinks = [
  { label: 'Home',     to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Get Quote',to: '/get-quote' },
]

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <TruckIcon />
          <span>Truck<span className="text-gradient">Flow</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__links hide-mobile">
          {navLinks.map(lk => (
            <Link
              key={lk.to}
              to={lk.to}
              className={`navbar__link ${location.pathname === lk.to ? 'navbar__link--active' : ''}`}
            >{lk.label}</Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="navbar__cta hide-mobile">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="btn btn-ghost btn-sm">Admin Panel</Link>
              )}
              <button onClick={logout} className="btn btn-outline btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/get-quote" className="btn btn-primary btn-sm">Get Quote</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        {navLinks.map(lk => (
          <Link key={lk.to} to={lk.to} className="navbar__mobile-link">{lk.label}</Link>
        ))}
        <div className="navbar__mobile-cta">
          {user ? (
            <button onClick={logout} className="btn btn-outline">Logout</button>
          ) : (
            <>
              <Link to="/login"    className="btn btn-outline">Login</Link>
              <Link to="/get-quote" className="btn btn-primary">Get Quote</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
