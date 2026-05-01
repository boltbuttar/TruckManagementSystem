import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'
import './Auth.css'

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', cdl: '', truckType: '', state: '', password: '', confirm: ''
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.name)    e.name    = 'Full name is required'
    if (!form.email)   e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.phone)   e.phone   = 'Phone is required'
    if (!form.cdl)     e.cdl     = 'CDL number is required'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Min 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      // Register the driver account, then log in with the returned token.
      const data = await (await import('../../services/api')).auth.register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        cdl: form.cdl,
        truckType: form.truckType,
        state: form.state,
        password: form.password,
      })
      // Persist the session using the token returned by the backend.
      await login({
        id: data.user?.id ?? data.id,
        name: data.user?.name ?? form.name,
        email: data.user?.email ?? form.email,
        role: data.user?.role ?? 'driver',
        token: data.token ?? data.accessToken,
      })
      navigate('/driver/dashboard')
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const fi = (k) => ({
    className: `form-input ${errors[k] ? 'error' : ''}`,
    value: form[k],
    onChange: e => set(k, e.target.value),
  })

  const truckTypes = ['Dry Van','Flatbed','Refrigerated','Step Deck','Lowboy','Box Truck']

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob--1" />
      <div className="auth-blob auth-blob--2" />
      <Navbar />

      <div className="auth-container" style={{ paddingTop: 120 }}>
        <div className="auth-card auth-card--wide">
          <div className="auth-card__header">
            <div className="auth-logo">🧑‍✈️</div>
            <h1 className="auth-title">Driver Registration</h1>
            <p className="auth-sub">Join TruckFlow and start receiving loads today</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input {...fi('name')} placeholder="John Smith" />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input type="email" {...fi('email')} placeholder="your@email.com" />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input type="tel" {...fi('phone')} placeholder="+1 (555) 000-0000" />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">CDL Number *</label>
                <input {...fi('cdl')} placeholder="e.g. A1234567" />
                {errors.cdl && <span className="form-error">{errors.cdl}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Truck Type</label>
                <select className="form-input" value={form.truckType} onChange={e => set('truckType', e.target.value)}>
                  <option value="">Select type</option>
                  {truckTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Home State</label>
                <input {...fi('state')} placeholder="e.g. California" />
              </div>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input type="password" {...fi('password')} placeholder="Min 8 characters" />
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input type="password" {...fi('confirm')} placeholder="Repeat password" />
                {errors.confirm && <span className="form-error">{errors.confirm}</span>}
              </div>
            </div>

            {errors.form && (
              <p className="form-error" style={{ marginBottom: 8 }}>{errors.form}</p>
            )}

            <button type="submit" className="btn btn-primary" style={{ width:'100%', marginTop:8 }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Driver Account →'}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
