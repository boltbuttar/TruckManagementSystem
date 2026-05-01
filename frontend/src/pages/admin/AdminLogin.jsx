import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AdminAuth.css'

export default function AdminLogin() {
  const [form, setForm]     = useState({ email: '', password: '' })
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
      await login({ email: form.email, password: form.password, role: 'admin' })
      navigate('/admin/dashboard')
    } catch (err) {
      setErrors({ form: err.message || 'Invalid admin credentials' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-auth">
      <div className="admin-auth__blob1" />
      <div className="admin-auth__blob2" />

      <div className="admin-auth__card">
        <div className="admin-auth__logo">
          <span className="admin-auth__logo-icon">🔑</span>
          <div className="admin-auth__logo-text">Truck<span className="text-gradient">Flow</span></div>
          <div className="admin-auth__logo-sub">Admin Portal</div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group" style={{ marginBottom: 18 }}>
            <label className="form-label">Admin Email</label>
            <input
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="admin@truckflow.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: 28 }}>
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

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Access Admin Panel →'}
          </button>
        </form>
      </div>
    </div>
  )
}
