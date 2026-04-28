import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import './Services.css'

const services = [
  {
    icon: '🚛', title: 'Load Assignment',
    features: ['Smart driver matching', 'Multi-stop routes', 'Load optimization', 'Capacity planning'],
    desc: 'Our AI-powered load assignment engine matches shipments to the most suitable available driver based on location, truck type, and route efficiency.'
  },
  {
    icon: '📍', title: 'Real-Time Dispatch',
    features: ['Live GPS tracking', 'Status notifications', 'ETA predictions', 'Incident reporting'],
    desc: 'Track every load from pickup to final delivery with live status updates, ETAs, and instant notifications for carriers and shippers.'
  },
  {
    icon: '💰', title: 'Quote Generation',
    features: ['Instant pricing', 'Distance-based rates', 'Cargo type pricing', 'Volume discounts'],
    desc: 'Generate competitive freight quotes instantly. Our pricing engine factors in distance, cargo weight, truck type, and market rates.'
  },
  {
    icon: '👤', title: 'Driver Management',
    features: ['CDL verification', 'Performance metrics', 'Availability calendar', 'Document storage'],
    desc: 'Comprehensive driver profiles with compliance tracking, performance history, and real-time availability management.'
  },
  {
    icon: '📊', title: 'Analytics & Reporting',
    features: ['Revenue tracking', 'Performance KPIs', 'Route analytics', 'Custom exports'],
    desc: 'Deep operational insights to optimize routes, reduce costs, and improve driver performance across your entire fleet.'
  },
  {
    icon: '🔒', title: 'Compliance & Security',
    features: ['Role-based access', 'Audit trails', 'Data encryption', 'FMCSA compliance'],
    desc: 'Enterprise-grade security with role-based permissions, complete audit logging, and FMCSA compliance tools built in.'
  },
]

export default function Services() {
  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section className="services-hero">
        <div className="services-hero__blob" />
        <div className="container" style={{ paddingTop: 160, paddingBottom: 80 }}>
          <div className="section-tag">Our Services</div>
          <h1 className="section-title">Complete Dispatch<br /><span className="text-gradient">Management Suite</span></h1>
          <p className="section-sub">
            Every tool your trucking operation needs — from driver onboarding to final delivery confirmation — in a single, unified platform.
          </p>
          <div style={{ display:'flex', gap:14, marginTop:36, flexWrap:'wrap' }}>
            <Link to="/get-quote" className="btn btn-primary btn-lg">Get a Quote →</Link>
            <Link to="/register"  className="btn btn-outline btn-lg">Join as Driver</Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          <div className="services-grid">
            {services.map((s, i) => (
              <div key={i} className="service-detail-card card">
                <div className="service-detail-card__icon">{s.icon}</div>
                <h3 className="service-detail-card__title">{s.title}</h3>
                <p className="service-detail-card__desc">{s.desc}</p>
                <ul className="service-detail-card__features">
                  {s.features.map((f, j) => (
                    <li key={j}><span className="feature-check">✓</span> {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm" style={{ textAlign:'center', paddingBottom:96 }}>
        <div className="container">
          <h2 className="section-title">Ready to get started?</h2>
          <p className="section-sub" style={{ margin:'16px auto 36px' }}>
            Sign up today and get your first dispatch handled within the hour.
          </p>
          <Link to="/get-quote" className="btn btn-primary btn-lg">Request a Load →</Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
