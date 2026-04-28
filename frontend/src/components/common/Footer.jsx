import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const socials = [
  { label: 'LinkedIn', href: '#', icon: '🔗' },
  { label: 'Twitter',  href: '#', icon: '🐦' },
  { label: 'Facebook', href: '#', icon: '📘' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            Truck<span className="text-gradient">Flow</span>
          </div>
          <p className="footer__tagline">
            America's most reliable truck dispatch & load management platform. Moving freight smarter, faster, everywhere.
          </p>
          <div className="footer__socials">
            {socials.map(s => (
              <a key={s.label} href={s.href} className="footer__social" aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="footer__col">
          <h4>Company</h4>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/get-quote">Get Quote</Link>
        </div>

        <div className="footer__col">
          <h4>Drivers</h4>
          <Link to="/register">Register</Link>
          <Link to="/login">Driver Login</Link>
          <Link to="/admin/login">Admin Login</Link>
        </div>

        <div className="footer__col">
          <h4>Contact</h4>
          <a href="tel:+12135550199">+1 (213) 555-0199</a>
          <a href="mailto:dispatch@truckflow.com">dispatch@truckflow.com</a>
          <span>Los Angeles, CA 90001</span>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} TruckFlow. All rights reserved.</span>
        <div className="footer__bottom-links">
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
