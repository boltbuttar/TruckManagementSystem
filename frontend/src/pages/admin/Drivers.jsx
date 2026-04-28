import React, { useState, useEffect } from 'react'
import { drivers as driversApi } from '../../services/api'
import './AdminPages.css'

const statusClass = { Active: 'badge-success', 'On Duty': 'badge-info', Inactive: 'badge-neutral' }
const statusOptions = ['Active', 'On Duty', 'Inactive']
const truckTypes    = ['Dry Van 48\'','Dry Van 53\'','Flatbed','Refrigerated','Step Deck','Lowboy','Box Truck']

const emptyForm = { name:'', email:'', phone:'', cdl:'', truck:'', state:'', status:'Active' }

export default function Drivers() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState('All')
  const [modal,   setModal]   = useState(null)
  const [form,    setForm]    = useState(emptyForm)
  const [editId,  setEditId]  = useState(null)
  const [errors,  setErrors]  = useState({})

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true)
        const response = await driversApi.getAll()
        const formattedDrivers = response.data.map(d => ({
          id: d.id,
          name: d.name,
          email: d.email,
          phone: d.phone,
          cdl: d.cdl || 'N/A',
          truck: d.truckMake ? `${d.truckMake} ${d.truckModel || ''}`.trim() : 'N/A',
          state: 'N/A',
          status: d.status || 'Active',
          loads: d.completedLoads || 0
        }))
        setDrivers(formattedDrivers)
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to fetch drivers')
        console.error('Failed to fetch drivers:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDrivers()
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const filtered = drivers.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
                        d.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || d.status === filter
    return matchSearch && matchFilter
  })

  const openAdd  = ()    => { setForm(emptyForm); setEditId(null); setErrors({}); setModal('edit') }
  const openEdit = (d)   => { setForm({ name:d.name,email:d.email,phone:d.phone,cdl:d.cdl,truck:d.truck,state:d.state,status:d.status }); setEditId(d.id); setErrors({}); setModal('edit') }
  const openDel  = (d)   => { setEditId(d.id); setModal('delete') }
  const closeModal       = ()    => { setModal(null); setEditId(null) }

  const validate = () => {
    const e = {}
    if (!form.name)  e.name  = 'Required'
    if (!form.email) e.email = 'Required'
    if (!form.cdl)   e.cdl   = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const saveDriver = () => {
    if (!validate()) return
    if (editId) {
      setDrivers(ds => ds.map(d => d.id === editId ? { ...d, ...form } : d))
    } else {
      setDrivers(ds => [...ds, { ...form, id: Date.now(), loads: 0 }])
    }
    closeModal()
  }

  const deleteDriver = () => {
    setDrivers(ds => ds.filter(d => d.id !== editId))
    closeModal()
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Drivers</h1>
          <p className="admin-page__sub">{loading ? 'Loading...' : `${drivers.length} registered drivers`}</p>
          {error && <p style={{color: 'var(--danger)', marginTop: 4, fontSize: '0.9em'}}>Error: {error}</p>}
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Driver</button>
      </div>

      {/* Filters */}
      <div className="admin-page__filters">
        <input
          className="form-input"
          placeholder="🔍  Search drivers..."
          style={{ maxWidth: 280 }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filter-tabs">
          {['All','Active','On Duty','Inactive'].map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >{f}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Driver</th><th>CDL #</th><th>Truck Type</th><th>State</th><th>Loads</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="data-table__empty">No drivers found</td></tr>
            ) : filtered.map(d => (
              <tr key={d.id}>
                <td>
                  <div className="driver-cell">
                    <div className="driver-avatar">{d.name[0]}</div>
                    <div>
                      <div className="driver-name">{d.name}</div>
                      <div className="driver-email">{d.email}</div>
                    </div>
                  </div>
                </td>
                <td className="data-mono">{d.cdl}</td>
                <td>{d.truck}</td>
                <td>{d.state}</td>
                <td><strong>{d.loads}</strong></td>
                <td><span className={`badge ${statusClass[d.status]}`}>{d.status}</span></td>
                <td>
                  <div className="action-btns">
                    <button className="action-btn edit"   onClick={() => openEdit(d)}>✏️</button>
                    <button className="action-btn delete" onClick={() => openDel(d)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modal === 'edit' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h3>{editId ? 'Edit Driver' : 'Add New Driver'}</h3>
              <button className="modal__close" onClick={closeModal}>✕</button>
            </div>
            <div className="grid-2" style={{ gap:16 }}>
              {[
                { k:'name',  l:'Full Name *',   p:'John Smith' },
                { k:'email', l:'Email *',        p:'john@email.com' },
                { k:'phone', l:'Phone',          p:'+1 555-0000' },
                { k:'cdl',   l:'CDL Number *',   p:'A1234567' },
                { k:'state', l:'Home State',     p:'Texas' },
              ].map(({ k, l, p }) => (
                <div className="form-group" key={k}>
                  <label className="form-label">{l}</label>
                  <input className={`form-input ${errors[k]?'error':''}`} placeholder={p} value={form[k]} onChange={e => set(k, e.target.value)} />
                  {errors[k] && <span className="form-error">{errors[k]}</span>}
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Truck Type</label>
                <select className="form-input" value={form.truck} onChange={e => set('truck', e.target.value)}>
                  <option value="">Select</option>
                  {truckTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input" value={form.status} onChange={e => set('status', e.target.value)}>
                  {statusOptions.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="modal__footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={saveDriver}>{editId ? 'Save Changes' : 'Add Driver'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {modal === 'delete' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal--sm" onClick={e => e.stopPropagation()}>
            <div className="modal__header"><h3>Delete Driver</h3><button className="modal__close" onClick={closeModal}>✕</button></div>
            <p style={{ color:'var(--text-secondary)', marginBottom:24 }}>Are you sure you want to remove this driver? This action cannot be undone.</p>
            <div className="modal__footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn" style={{ background:'var(--danger)', color:'#fff' }} onClick={deleteDriver}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
