import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'
import './Auth.css'

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '', role: 'driver' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.email)    e.email    = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const user = await login({ email: form.email, password: form.password, role: form.role })
      if (user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/driver/dashboard')
      }
    } catch (err) {
      setErrors({ form: err.message || 'Invalid email or password' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob--1" />
      <div className="auth-blob auth-blob--2" />
      <Navbar />

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card__header">
            <div className="auth-logo">🚛</div>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-sub">Sign in to your TruckFlow account</p>
          </div>

          {/* Role toggle */}
          <div className="auth-role-toggle">
            <button
              className={form.role === 'driver' ? 'active' : ''}
              onClick={() => set('role', 'driver')}
              type="button"
            >🧑‍✈️ Driver</button>
            <button
              className={form.role === 'admin' ? 'active' : ''}
              onClick={() => set('role', 'admin')}
              type="button"
            >🔑 Admin</button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="your@email.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                value={form.password}
                onChange={e => set('password', e.target.value)}
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            {errors.form && (
              <p className="form-error" style={{ marginBottom: 12 }}>{errors.form}</p>
            )}

            <button type="submit" className="btn btn-primary" style={{ width:'100%' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
