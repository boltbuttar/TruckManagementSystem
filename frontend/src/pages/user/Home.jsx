import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Truck, MapPin, DollarSign, Clipboard, Lock, BarChart3, Rocket, Check } from 'lucide-react'
import Navbar  from '../../components/common/Navbar'
import Footer  from '../../components/common/Footer'
import './Home.css'

/* ── Animated counter ── */
function Counter({ end, suffix = '', duration = 2000 }) {
  const [val, setVal] = useState(0)
  const ref = useRef()
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      let start = 0
      const step = Math.ceil(end / (duration / 16))
      const timer = setInterval(() => {
        start = Math.min(start + step, end)
        setVal(start)
        if (start >= end) clearInterval(timer)
      }, 16)
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, duration])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

const stats = [
  { label: 'Active Drivers',    value: 1200, suffix: '+' },
  { label: 'Loads Delivered',   value: 45000, suffix: '+' },
  { label: 'States Covered',    value: 48,   suffix: '' },
  { label: 'On-Time Rate',      value: 98,   suffix: '%' },
]

const services = [
  {
    Icon: Truck,
    title: 'Smart Load Assignment',
    desc: 'Instantly match available drivers to loads based on location, capacity, and route — automated and optimized.',
  },
  {
    Icon: MapPin,
    title: 'Real-Time Dispatch',
    desc: 'Live status updates from pickup to delivery. Know exactly where every load is at any moment.',
  },
  {
    Icon: DollarSign,
    title: 'Instant Quote Engine',
    desc: 'Get freight quotes in seconds. Transparent pricing based on route distance, cargo weight, and type.',
  },
  {
    Icon: Clipboard,
    title: 'Driver Management',
    desc: 'Full driver profiles, CDL tracking, availability status, and compliance documentation in one place.',
  },
  {
    Icon: Lock,
    title: 'Secure & Compliant',
    desc: 'Role-based access, encrypted data, and audit trails to keep your operations safe and compliant.',
  },
  {
    Icon: BarChart3,
    title: 'Analytics Dashboard',
    desc: 'Track KPIs, revenue trends, driver performance, and load history with powerful reporting tools.',
  },
]

const steps = [
  { num: '01', title: 'Register / Login',   desc: 'Create your account as a driver or company in under 2 minutes.' },
  { num: '02', title: 'Submit Load Request', desc: 'Fill in your pickup, delivery, cargo details — get an instant quote.' },
  { num: '03', title: 'Get Dispatched',      desc: 'Admin assigns the best driver; track status updates in real time.' },
]

const testimonials = [
  { name: 'Marcus T.', role: 'Fleet Owner, TX', text: 'TruckFlow cut our dispatch time by 60%. The load assignment system is a game-changer for our 50-truck fleet.' },
  { name: 'Sarah K.',  role: 'Freight Broker, CA', text: 'The quote engine is incredibly accurate and fast. Our clients love the real-time status updates.' },
  { name: 'James R.',  role: 'OTR Driver',          text: 'Finally a dispatch platform that respects drivers. Easy to use, clear communication, and fast pay.' },
]

export default function Home() {
  return (
    <div className="home">
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />
        <div className="container hero__inner">
          <div className="hero__content animate-fade-up">
            <div className="section-tag"><Rocket size={16} style={{ display: 'inline' }} /> &nbsp;America's #1 Dispatch Platform</div>
            <h1 className="hero__title">
              Move Freight <br />
              <span className="text-gradient">Smarter &amp; Faster</span>
            </h1>
            <p className="hero__sub">
              TruckFlow connects carriers, drivers, and shippers through an intelligent dispatch management system — real-time tracking, instant quotes, and seamless load assignment.
            </p>
            <div className="hero__actions">
              <Link to="/get-quote" className="btn btn-primary btn-lg">Get Your Quote →</Link>
              <Link to="/register" className="btn btn-outline btn-lg">Register as Driver</Link>
            </div>
            <div className="hero__trust">
              <span><Check size={16} style={{ display: 'inline', marginRight: '6px' }} />No setup fees</span>
              <span><Check size={16} style={{ display: 'inline', marginRight: '6px' }} />24/7 support</span>
              <span><Check size={16} style={{ display: 'inline', marginRight: '6px' }} />48 states coverage</span>
            </div>
          </div>
          <div className="hero__visual animate-float">
            <div className="hero__truck-card">
              <div className="hero__truck-icon"><Truck size={36} strokeWidth={1.5} /></div>
              <div>
                <div className="hero__truck-status">IN TRANSIT</div>
                <div className="hero__truck-route">Los Angeles → Chicago</div>
              </div>
              <span className="badge badge-success">● Live</span>
            </div>
            <div className="hero__stat-mini hero__stat-mini--1">
              <span className="hero__mini-val">98%</span>
              <span className="hero__mini-label">On-Time Rate</span>
            </div>
            <div className="hero__stat-mini hero__stat-mini--2">
              <span className="hero__mini-val">45K+</span>
              <span className="hero__mini-label">Loads Delivered</span>
            </div>
            <div className="hero__truck-graphic">🛣️</div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-bar">
        <div className="container stats-bar__grid">
          {stats.map((s, i) => (
            <div key={i} className="stats-bar__item">
              <div className="stats-bar__val">
                <Counter end={s.value} suffix={s.suffix} />
              </div>
              <div className="stats-bar__label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="section" id="services">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-tag" style={{ margin: '0 auto 16px' }}>Our Services</div>
            <h2 className="section-title">Everything you need to<br /><span className="text-gradient">run efficient dispatch</span></h2>
            <p className="section-sub" style={{ margin: '16px auto 0', textAlign: 'center' }}>
              A complete suite of logistics tools built specifically for trucking companies, independent drivers, and freight brokers.
            </p>
          </div>
          <div className="grid-3">
            {services.map((s, i) => (
              <div key={i} className="card service-card">
                <div className="service-card__icon"><s.Icon size={40} strokeWidth={1.5} /></div>
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__desc">{s.desc}</p>
                <Link to="/services" className="service-card__link">Learn more →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section section">
        <div className="how-section__bg" />
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-tag" style={{ margin: '0 auto 16px' }}>Process</div>
            <h2 className="section-title">From request to delivery<br /><span className="text-gradient">in 3 simple steps</span></h2>
          </div>
          <div className="how-steps">
            {steps.map((s, i) => (
              <div key={i} className="how-step">
                <div className="how-step__num">{s.num}</div>
                <h3 className="how-step__title">{s.title}</h3>
                <p className="how-step__desc">{s.desc}</p>
                {i < steps.length - 1 && <div className="how-step__arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section" id="testimonials">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-tag" style={{ margin: '0 auto 16px' }}>Testimonials</div>
            <h2 className="section-title">Trusted by <span className="text-gradient">1,200+ drivers</span><br />and fleet owners</h2>
          </div>
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <div key={i} className="card testimonial-card">
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner section-sm">
        <div className="container">
          <div className="cta-banner__inner">
            <div className="cta-banner__glow" />
            <div className="cta-banner__content">
              <h2 className="cta-banner__title">Ready to streamline your<br /><span className="text-gradient">dispatch operations?</span></h2>
              <p className="cta-banner__sub">Join 1,200+ drivers and fleet owners already using TruckFlow. Get your first quote free.</p>
              <div className="cta-banner__actions">
                <Link to="/get-quote" className="btn btn-primary btn-lg">Get a Free Quote →</Link>
                <Link to="/register" className="btn btn-outline btn-lg">Register Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
