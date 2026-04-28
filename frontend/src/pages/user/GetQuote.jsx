import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import './GetQuote.css'

const steps = ['Pickup & Delivery', 'Cargo Details', 'Contact Info', 'Your Quote']

const truckTypes = ['Dry Van (48\')', 'Dry Van (53\')', 'Flatbed', 'Refrigerated', 'Step Deck', 'Lowboy', 'Box Truck']
const cargoTypes = ['General Freight', 'Produce / Perishables', 'Machinery', 'Construction Materials', 'Electronics', 'Automotive', 'Hazmat']

function calcQuote(form) {
  const base = 2.5
  const miles = Math.floor(Math.random() * 1000) + 500
  const weight = parseFloat(form.weight) || 20000
  const price = (miles * base + weight * 0.002).toFixed(2)
  return { miles, price, transit: Math.ceil(miles / 500) }
}

export default function GetQuote() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    pickup: '', pickupDate: '', delivery: '', deliveryDate: '',
    weight: '', truckType: '', cargoType: '', specialInstructions: '',
    name: '', company: '', email: '', phone: '',
  })
  const [errors, setErrors]   = useState({})
  const [quote, setQuote]     = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (step === 0) {
      if (!form.pickup)      e.pickup      = 'Pickup location is required'
      if (!form.pickupDate)  e.pickupDate  = 'Pickup date is required'
      if (!form.delivery)    e.delivery    = 'Delivery location is required'
    }
    if (step === 1) {
      if (!form.weight)    e.weight    = 'Weight is required'
      if (!form.truckType) e.truckType = 'Truck type is required'
      if (!form.cargoType) e.cargoType = 'Cargo type is required'
    }
    if (step === 2) {
      if (!form.name)  e.name  = 'Name is required'
      if (!form.email) e.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
      if (!form.phone) e.phone = 'Phone is required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, 3)) }
  const prev = () => setStep(s => Math.max(s - 1, 0))

  const submit = () => {
    if (!validate()) return
    setSubmitting(true)
    setTimeout(() => {
      setQuote(calcQuote(form))
      setStep(3)
      setSubmitting(false)
    }, 1200)
  }

  const fi = (k) => ({
    className: `form-input${errors[k] ? ' error' : ''}`,
    value: form[k],
    onChange: e => set(k, e.target.value),
  })

  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh' }}>
      <Navbar />

      <section className="quote-hero">
        <div className="quote-blob" />
        <div className="container" style={{ paddingTop: 160, paddingBottom: 60 }}>
          <div className="section-tag">Get a Quote</div>
          <h1 className="section-title">Instant Freight<br /><span className="text-gradient">Price Estimate</span></h1>
          <p className="section-sub">Fill in your shipment details and get a competitive rate in under 60 seconds.</p>
        </div>
      </section>

      <section className="section-sm" style={{ paddingBottom: 96 }}>
        <div className="container">
          <div className="quote-card">
            {/* Step indicator */}
            <div className="quote-steps">
              {steps.map((s, i) => (
                <div key={i} className={`quote-step-item ${i === step ? 'active' : i < step ? 'done' : ''}`}>
                  <div className="quote-step-bubble">{i < step ? '✓' : i + 1}</div>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            {/* Step 0 */}
            {step === 0 && (
              <div className="quote-form animate-fade-up">
                <h3 className="quote-form-title">Pickup & Delivery Locations</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Pickup Location *</label>
                    <input {...fi('pickup')} placeholder="City, State or ZIP" className={fi('pickup').className} />
                    {errors.pickup && <span className="form-error">{errors.pickup}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pickup Date *</label>
                    <input type="date" {...fi('pickupDate')} className={fi('pickupDate').className} />
                    {errors.pickupDate && <span className="form-error">{errors.pickupDate}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Delivery Location *</label>
                    <input {...fi('delivery')} placeholder="City, State or ZIP" className={fi('delivery').className} />
                    {errors.delivery && <span className="form-error">{errors.delivery}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Delivery Date</label>
                    <input type="date" {...fi('deliveryDate')} className={fi('deliveryDate').className} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <div className="quote-form animate-fade-up">
                <h3 className="quote-form-title">Cargo Details</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Truck Type *</label>
                    <select {...fi('truckType')} className={fi('truckType').className}>
                      <option value="">Select truck type</option>
                      {truckTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                    {errors.truckType && <span className="form-error">{errors.truckType}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cargo Type *</label>
                    <select {...fi('cargoType')} className={fi('cargoType').className}>
                      <option value="">Select cargo type</option>
                      {cargoTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                    {errors.cargoType && <span className="form-error">{errors.cargoType}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight (lbs) *</label>
                    <input type="number" {...fi('weight')} placeholder="e.g. 20000" className={fi('weight').className} />
                    {errors.weight && <span className="form-error">{errors.weight}</span>}
                  </div>
                  <div className="form-group" style={{ gridColumn:'1/-1' }}>
                    <label className="form-label">Special Instructions</label>
                    <textarea {...fi('specialInstructions')} rows={3} placeholder="Any special handling requirements..." className="form-input" style={{ resize:'vertical' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="quote-form animate-fade-up">
                <h3 className="quote-form-title">Your Contact Info</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input {...fi('name')} placeholder="John Smith" className={fi('name').className} />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input {...fi('company')} placeholder="Your company (optional)" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input type="email" {...fi('email')} placeholder="john@example.com" className={fi('email').className} />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input type="tel" {...fi('phone')} placeholder="+1 (555) 000-0000" className={fi('phone').className} />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 — Quote Result */}
            {step === 3 && quote && (
              <div className="quote-result animate-fade-up">
                <div className="quote-result__icon">🎉</div>
                <h3>Your Estimated Quote</h3>
                <div className="quote-result__price">${Number(quote.price).toLocaleString()}</div>
                <div className="quote-result__meta">
                  <div><span>Estimated Miles</span><strong>{quote.miles.toLocaleString()} mi</strong></div>
                  <div><span>Transit Time</span><strong>{quote.transit} day{quote.transit > 1 ? 's' : ''}</strong></div>
                  <div><span>Truck Type</span><strong>{form.truckType}</strong></div>
                  <div><span>Route</span><strong>{form.pickup} → {form.delivery}</strong></div>
                </div>
                <p className="quote-result__note">
                  A dispatch coordinator will contact you at <strong>{form.email}</strong> within 1 hour to confirm.
                </p>
                <div style={{ display:'flex', gap:12, justifyContent:'center', marginTop:24 }}>
                  <Link to="/" className="btn btn-outline">Back to Home</Link>
                  <button onClick={() => { setStep(0); setQuote(null) }} className="btn btn-primary">New Quote</button>
                </div>
              </div>
            )}

            {/* Nav buttons */}
            {step < 3 && (
              <div className="quote-nav">
                {step > 0 && <button className="btn btn-ghost" onClick={prev}>← Back</button>}
                {step < 2 && <button className="btn btn-primary" onClick={next} style={{ marginLeft:'auto' }}>Continue →</button>}
                {step === 2 && (
                  <button className="btn btn-primary" onClick={submit} disabled={submitting} style={{ marginLeft:'auto' }}>
                    {submitting ? 'Calculating...' : 'Get My Quote 💰'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
