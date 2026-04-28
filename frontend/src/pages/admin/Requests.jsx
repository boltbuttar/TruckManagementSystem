import React, { useState } from 'react'
import './AdminPages.css'

const initialRequests = [
  { id:'RQ-1021', name:'Johnson Freight Co.',  email:'jf@email.com', pickup:'Miami, FL',      delivery:'Boston, MA',      cargo:'Electronics',     weight:'22,000', date:'2026-04-27', status:'Pending'  },
  { id:'RQ-1020', name:'Atlas Logistics',      email:'al@email.com', pickup:'Chicago, IL',    delivery:'Phoenix, AZ',     cargo:'Machinery',       weight:'50,000', date:'2026-04-26', status:'Quoted'   },
  { id:'RQ-1019', name:'Pacific Shippers',     email:'ps@email.com', pickup:'Seattle, WA',    delivery:'Las Vegas, NV',   cargo:'General Freight', weight:'35,000', date:'2026-04-26', status:'Accepted' },
  { id:'RQ-1018', name:'FastFreight Inc.',     email:'ff@email.com', pickup:'Houston, TX',    delivery:'Detroit, MI',     cargo:'Automotive',      weight:'48,000', date:'2026-04-25', status:'Pending'  },
  { id:'RQ-1017', name:'NorthStar Cargo',      email:'ns@email.com', pickup:'Denver, CO',     delivery:'Salt Lake City, UT',cargo:'Produce',       weight:'28,000', date:'2026-04-25', status:'Rejected' },
  { id:'RQ-1016', name:'SunState Transport',   email:'ss@email.com', pickup:'Orlando, FL',    delivery:'Nashville, TN',   cargo:'Construction',    weight:'60,000', date:'2026-04-24', status:'Accepted' },
]

const statusClass = { Pending:'badge-warning', Quoted:'badge-info', Accepted:'badge-success', Rejected:'badge-danger' }

export default function Requests() {
  const [requests, setRequests] = useState(initialRequests)
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('All')
  const [modal,    setModal]    = useState(null)
  const [selected, setSelected] = useState(null)
  const [quote,    setQuote]    = useState('')

  const filtered = requests.filter(r => {
    const q = r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())
    return q && (filter === 'All' || r.status === filter)
  })

  const updateStatus = (id, status) => setRequests(rs => rs.map(r => r.id === id ? { ...r, status } : r))

  const openQuote = (r) => { setSelected(r); setQuote(''); setModal('quote') }
  const sendQuote = () => {
    if (!quote) return
    updateStatus(selected.id, 'Quoted')
    setModal(null)
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Load Requests</h1>
          <p className="admin-page__sub">
            {requests.filter(r => r.status === 'Pending').length} pending · {requests.length} total
          </p>
        </div>
      </div>

      <div className="admin-page__filters">
        <input className="form-input" placeholder="🔍  Search by name or ID..." style={{ maxWidth:280 }} value={search} onChange={e => setSearch(e.target.value)} />
        <div className="filter-tabs">
          {['All','Pending','Quoted','Accepted','Rejected'].map(f => (
            <button key={f} className={`filter-tab ${filter===f?'active':''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Req ID</th><th>Company</th><th>Route</th><th>Cargo</th><th>Weight</th><th>Date</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={8} className="data-table__empty">No requests found</td></tr>
              : filtered.map(r => (
                <tr key={r.id}>
                  <td className="data-mono">{r.id}</td>
                  <td>
                    <div className="driver-name">{r.name}</div>
                    <div className="driver-email">{r.email}</div>
                  </td>
                  <td style={{ fontSize:12 }}>{r.pickup} → {r.delivery}</td>
                  <td>{r.cargo}</td>
                  <td>{r.weight} lbs</td>
                  <td style={{ color:'var(--text-muted)', fontSize:12 }}>{r.date}</td>
                  <td><span className={`badge ${statusClass[r.status]}`}>{r.status}</span></td>
                  <td>
                    <div className="action-btns">
                      {r.status === 'Pending' && (
                        <>
                          <button className="action-btn edit" title="Send Quote" onClick={() => openQuote(r)}>💰</button>
                          <button className="action-btn edit" title="Accept" style={{ fontSize:15 }} onClick={() => updateStatus(r.id,'Accepted')}>✅</button>
                          <button className="action-btn delete" title="Reject" onClick={() => updateStatus(r.id,'Rejected')}>❌</button>
                        </>
                      )}
                      {r.status !== 'Pending' && <span style={{ fontSize:12, color:'var(--text-muted)' }}>—</span>}
                    </div>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quote Modal */}
      {modal === 'quote' && selected && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal modal--sm" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h3>Send Quote</h3>
              <button className="modal__close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div style={{ marginBottom:16 }}>
              <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:4 }}>Request: <strong style={{ color:'var(--text-primary)' }}>{selected.id}</strong></p>
              <p style={{ fontSize:13, color:'var(--text-muted)' }}>Route: <strong style={{ color:'var(--text-primary)' }}>{selected.pickup} → {selected.delivery}</strong></p>
            </div>
            <div className="form-group" style={{ marginBottom:20 }}>
              <label className="form-label">Quote Amount (USD) *</label>
              <input className="form-input" type="number" placeholder="e.g. 4500" value={quote} onChange={e => setQuote(e.target.value)} />
            </div>
            <div className="modal__footer">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={sendQuote}>Send Quote 💰</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
