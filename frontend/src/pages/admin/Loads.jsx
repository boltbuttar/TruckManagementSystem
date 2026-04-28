import React, { useState, useEffect } from 'react'
import { loads as loadsApi, drivers as driversApi } from '../../services/api'
import './AdminPages.css'

const statusClass = { 'In Transit':'badge-info', 'Delivered':'badge-success', 'Pending':'badge-warning', 'Cancelled':'badge-danger' }
const statusOptions = ['Pending','In Transit','Delivered','Cancelled']
const truckTypes    = ['Dry Van 48\'','Dry Van 53\'','Flatbed','Refrigerated','Step Deck']
const cargoTypes    = ['General Freight','Produce','Machinery','Electronics','Automotive','Construction']
const emptyForm     = { pickup:'', delivery:'', cargo:'', weight:'', driver:'Unassigned', truckType:'', status:'Pending', date:'' }

export default function Loads() {
  const [loads,   setLoads]   = useState([])
  const [driverList, setDriverList] = useState(['Unassigned'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState('All')
  const [modal,   setModal]   = useState(null)
  const [form,    setForm]    = useState(emptyForm)
  const [editId,  setEditId]  = useState(null)
  const [errors,  setErrors]  = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [loadsRes, driversRes] = await Promise.all([loadsApi.getAll(), driversApi.getAll()])
        
        const formattedLoads = loadsRes.data.map(l => ({
          id: l.loadId || l.id,
          pickup: l.pickup?.city ? `${l.pickup.city}, ${l.pickup.state}` : 'N/A',
          delivery: l.delivery?.city ? `${l.delivery.city}, ${l.delivery.state}` : 'N/A',
          cargo: l.cargoType || 'General Freight',
          weight: l.weight ? `${l.weight.toLocaleString()} lbs` : 'N/A',
          driver: l.driver?.name || 'Unassigned',
          status: l.status || 'Pending',
          date: l.createdAt ? new Date(l.createdAt).toISOString().split('T')[0] : ''
        }))
        setLoads(formattedLoads)
        
        const driverNames = driversRes.data.map(d => d.name)
        setDriverList(['Unassigned', ...driverNames])
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to fetch loads')
        console.error('Failed to fetch loads:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const filtered = loads.filter(l => {
    const q = search.toLowerCase()
    const matchSearch = l.id.toLowerCase().includes(q) || l.pickup.toLowerCase().includes(q) || l.delivery.toLowerCase().includes(q)
    return matchSearch && (filter === 'All' || l.status === filter)
  })

  const openAdd  = ()  => { setForm(emptyForm); setEditId(null); setErrors({}); setModal('edit') }
  const openEdit = (l) => { setForm({ pickup:l.pickup,delivery:l.delivery,cargo:l.cargo,weight:l.weight,driver:l.driver,truckType:l.truckType||'',status:l.status,date:l.date }); setEditId(l.id); setErrors({}); setModal('edit') }
  const openDel  = (l) => { setEditId(l.id); setModal('delete') }
  const closeModal     = ()  => { setModal(null); setEditId(null) }

  const validate = () => {
    const e = {}
    if (!form.pickup)   e.pickup   = 'Required'
    if (!form.delivery) e.delivery = 'Required'
    if (!form.cargo)    e.cargo    = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const save = () => {
    if (!validate()) return
    if (editId) {
      setLoads(ls => ls.map(l => l.id === editId ? { ...l, ...form } : l))
    } else {
      const newId = `TF-${Math.floor(4900 + Math.random()*100)}`
      setLoads(ls => [{ ...form, id: newId }, ...ls])
    }
    closeModal()
  }

  const del = () => { setLoads(ls => ls.filter(l => l.id !== editId)); closeModal() }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Loads</h1>
          <p className="admin-page__sub">{loading ? 'Loading...' : `${loads.length} total loads`}</p>
          {error && <p style={{color: 'var(--danger)', marginTop: 4, fontSize: '0.9em'}}>Error: {error}</p>}
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ New Load</button>
      </div>

      <div className="admin-page__filters">
        <input className="form-input" placeholder="🔍  Search by ID, route..." style={{ maxWidth:280 }} value={search} onChange={e => setSearch(e.target.value)} />
        <div className="filter-tabs">
          {['All','Pending','In Transit','Delivered','Cancelled'].map(f => (
            <button key={f} className={`filter-tab ${filter===f?'active':''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Load ID</th><th>Pickup</th><th>Delivery</th><th>Cargo</th><th>Weight</th><th>Driver</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={8} className="data-table__empty">No loads found</td></tr>
              : filtered.map(l => (
                <tr key={l.id}>
                  <td className="data-mono">{l.id}</td>
                  <td>{l.pickup}</td>
                  <td>{l.delivery}</td>
                  <td>{l.cargo}</td>
                  <td>{l.weight}</td>
                  <td>
                    <span className={l.driver === 'Unassigned' ? 'text-muted' : ''}>{l.driver}</span>
                  </td>
                  <td><span className={`badge ${statusClass[l.status]}`}>{l.status}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit"   onClick={() => openEdit(l)}>✏️</button>
                      <button className="action-btn delete" onClick={() => openDel(l)}>🗑️</button>
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
              <h3>{editId ? 'Edit Load' : 'Create New Load'}</h3>
              <button className="modal__close" onClick={closeModal}>✕</button>
            </div>
            <div className="grid-2" style={{ gap:16 }}>
              {[
                { k:'pickup',   l:'Pickup Location *',   p:'City, State' },
                { k:'delivery', l:'Delivery Location *', p:'City, State' },
                { k:'weight',   l:'Weight (lbs)',         p:'e.g. 42,000 lbs' },
                { k:'date',     l:'Pickup Date',          p:'', type:'date' },
              ].map(({ k,l,p,type }) => (
                <div className="form-group" key={k}>
                  <label className="form-label">{l}</label>
                  <input type={type||'text'} className={`form-input ${errors[k]?'error':''}`} placeholder={p} value={form[k]} onChange={e => set(k, e.target.value)} />
                  {errors[k] && <span className="form-error">{errors[k]}</span>}
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Cargo Type *</label>
                <select className={`form-input ${errors.cargo?'error':''}`} value={form.cargo} onChange={e => set('cargo', e.target.value)}>
                  <option value="">Select</option>
                  {cargoTypes.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.cargo && <span className="form-error">{errors.cargo}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Truck Type</label>
                <select className="form-input" value={form.truckType} onChange={e => set('truckType', e.target.value)}>
                  <option value="">Select</option>
                  {truckTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assign Driver</label>
                <select className="form-input" value={form.driver} onChange={e => set('driver', e.target.value)}>
                  {driverList.map(d => <option key={d}>{d}</option>)}
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
              <button className="btn btn-primary" onClick={save}>{editId ? 'Save Changes' : 'Create Load'}</button>
            </div>
          </div>
        </div>
      )}

      {modal === 'delete' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal--sm" onClick={e => e.stopPropagation()}>
            <div className="modal__header"><h3>Delete Load</h3><button className="modal__close" onClick={closeModal}>✕</button></div>
            <p style={{ color:'var(--text-secondary)', marginBottom:24 }}>Remove this load from the system? This cannot be undone.</p>
            <div className="modal__footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn" style={{ background:'var(--danger)', color:'#fff' }} onClick={del}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
