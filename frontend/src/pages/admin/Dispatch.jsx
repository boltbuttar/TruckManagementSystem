import React, { useState, useEffect } from 'react'
import './AdminPages.css'
import './Dispatch.css'

const pipeline = ['Order Placed', 'Driver Assigned', 'Pickup Confirmed', 'In Transit', 'Out for Delivery', 'Delivered']

const initialLoads = [
  { id:'TF-4821', driver:'Marcus Thompson', route:'Los Angeles, CA → Chicago, IL',    cargo:'General Freight', step:3, updated: '2h ago'  },
  { id:'TF-4818', driver:'Lena Morrison',   route:'Seattle, WA → San Francisco, CA',  cargo:'Produce',         step:4, updated: '8h ago'  },
  { id:'TF-4816', driver:'Unassigned',       route:'Phoenix, AZ → Portland, OR',       cargo:'General Freight', step:0, updated: '1d ago'  },
  { id:'TF-4815', driver:'Tom Bradley',     route:'Houston, TX → Atlanta, GA',         cargo:'Automotive',      step:5, updated: '14h ago' },
  { id:'TF-4814', driver:'James Rivera',    route:'Dallas, TX → Denver, CO',           cargo:'Machinery',       step:2, updated: '4h ago'  },
]

export default function Dispatch() {
  const [loads, setLoads] = useState(initialLoads)
  const [selected, setSelected] = useState(null)

  // Simulate live progress for in-transit loads
  useEffect(() => {
    const timer = setInterval(() => {
      setLoads(ls => ls.map(l => {
        if (l.step >= 3 && l.step < 4 && Math.random() > 0.92) {
          return { ...l, step: Math.min(l.step + 1, 5), updated: 'just now' }
        }
        return l
      }))
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const advance = (id) => {
    setLoads(ls => ls.map(l => l.id === id ? { ...l, step: Math.min(l.step + 1, 5), updated: 'just now' } : l))
  }

  const stepColor = (step) => {
    if (step === 5) return 'var(--success)'
    if (step >= 3)  return 'var(--info)'
    if (step >= 1)  return 'var(--warning)'
    return 'var(--text-muted)'
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Dispatch Status</h1>
          <p className="admin-page__sub">Real-time load tracking & status updates</p>
        </div>
        <div className="live-badge">
          <span className="live-dot" />
          Live Updates
        </div>
      </div>

      <div className="dispatch-grid">
        {/* Load list */}
        <div className="dispatch-list">
          {loads.map(l => (
            <div
              key={l.id}
              className={`dispatch-card ${selected?.id === l.id ? 'dispatch-card--active' : ''}`}
              onClick={() => setSelected(l)}
            >
              <div className="dispatch-card__top">
                <span className="dispatch-card__id">{l.id}</span>
                <span className="dispatch-card__updated">{l.updated}</span>
              </div>
              <div className="dispatch-card__route">{l.route}</div>
              <div className="dispatch-card__meta">
                <span>🧑‍✈️ {l.driver}</span>
                <span>📦 {l.cargo}</span>
              </div>
              {/* Mini progress */}
              <div className="dispatch-mini-bar">
                <div className="dispatch-mini-fill" style={{ width:`${(l.step / (pipeline.length-1)) * 100}%`, background: stepColor(l.step) }} />
              </div>
              <div className="dispatch-card__step" style={{ color: stepColor(l.step) }}>
                {pipeline[l.step]}
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="dispatch-detail">
          {selected ? (
            <>
              <div className="dispatch-detail__header">
                <div>
                  <div className="dispatch-detail__id">{selected.id}</div>
                  <div className="dispatch-detail__route">{selected.route}</div>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => { advance(selected.id); setSelected(s => ({ ...s, step: Math.min(s.step+1, 5), updated:'just now' })) }}
                  disabled={selected.step >= 5}
                >
                  {selected.step >= 5 ? '✅ Completed' : 'Advance Step →'}
                </button>
              </div>

              {/* Timeline */}
              <div className="dispatch-timeline">
                {pipeline.map((step, i) => {
                  const done    = i < selected.step
                  const current = i === selected.step
                  return (
                    <div key={i} className={`timeline-item ${done?'done':''} ${current?'current':''}`}>
                      <div className="timeline-item__left">
                        <div className="timeline-dot">
                          {done ? '✓' : current ? '●' : i+1}
                        </div>
                        {i < pipeline.length - 1 && <div className="timeline-line" />}
                      </div>
                      <div className="timeline-item__body">
                        <div className="timeline-item__title">{step}</div>
                        {done    && <div className="timeline-item__sub">Completed</div>}
                        {current && <div className="timeline-item__sub" style={{ color:'var(--accent-orange)' }}>In Progress — {selected.updated}</div>}
                        {!done && !current && <div className="timeline-item__sub">Pending</div>}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="dispatch-detail__info">
                <div><span>Driver</span><strong>{selected.driver}</strong></div>
                <div><span>Cargo</span><strong>{selected.cargo}</strong></div>
                <div><span>Current Step</span><strong>{pipeline[selected.step]}</strong></div>
                <div><span>Last Update</span><strong>{selected.updated}</strong></div>
              </div>
            </>
          ) : (
            <div className="dispatch-detail__empty">
              <div style={{ fontSize:48 }}>🗺️</div>
              <p>Select a load to view dispatch details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
