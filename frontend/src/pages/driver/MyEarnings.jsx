import React, { useState } from 'react'
import './MyEarnings.css'

const mockEarningsData = {
  totalEarnings: 12450,
  monthlyEarnings: 3200,
  averagePerLoad: 518,
  loadsCompleted: 24,
  monthlyLoads: 6
}

const monthlyBreakdown = [
  { month: 'Jan', amount: 2800, loads: 5 },
  { month: 'Feb', amount: 3100, loads: 6 },
  { month: 'Mar', amount: 3350, loads: 6 },
  { month: 'Apr', amount: 3200, loads: 6 }
]

const topLoads = [
  { id: 'L001', pickup: 'NYC', delivery: 'Boston', amount: 650, date: '2026-04-15' },
  { id: 'L002', pickup: 'Boston', delivery: 'Philly', amount: 580, date: '2026-04-10' },
  { id: 'L003', pickup: 'Washington', delivery: 'Atlanta', amount: 720, date: '2026-04-05' },
  { id: 'L004', pickup: 'Charlotte', delivery: 'DC', amount: 520, date: '2026-03-28' },
  { id: 'L005', pickup: 'Atlanta', delivery: 'Miami', amount: 680, date: '2026-03-20' }
]

export default function MyEarnings() {
  const [timeRange, setTimeRange] = useState('all-time')

  const maxAmount = Math.max(...monthlyBreakdown.map(m => m.amount))

  return (
    <div className="my-earnings">
      <h1>My Earnings</h1>
      <p className="my-earnings__subtitle">Track your income and performance</p>

      {/* Main Stats */}
      <div className="earnings-stats">
        <div className="earnings-stat-card earnings-stat-card--primary">
          <div className="stat-label">Total Earnings</div>
          <div className="stat-value">${mockEarningsData.totalEarnings.toLocaleString()}</div>
          <div className="stat-meta">Across {mockEarningsData.loadsCompleted} loads</div>
        </div>

        <div className="earnings-stat-card earnings-stat-card--success">
          <div className="stat-label">This Month</div>
          <div className="stat-value">${mockEarningsData.monthlyEarnings.toLocaleString()}</div>
          <div className="stat-meta">{mockEarningsData.monthlyLoads} loads completed</div>
        </div>

        <div className="earnings-stat-card earnings-stat-card--accent">
          <div className="stat-label">Average per Load</div>
          <div className="stat-value">${mockEarningsData.averagePerLoad}</div>
          <div className="stat-meta">Based on all loads</div>
        </div>

        <div className="earnings-stat-card earnings-stat-card--warning">
          <div className="stat-label">Pending Payment</div>
          <div className="stat-value">$1,200</div>
          <div className="stat-meta">Next payout: May 5</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="earnings-chart-section">
        <div className="section-header">
          <h2>Monthly Breakdown</h2>
          <div className="time-range-buttons">
            <button
              className={`btn btn--sm ${timeRange === 'month' ? 'btn--primary' : 'btn--ghost'}`}
              onClick={() => setTimeRange('month')}
            >
              This Month
            </button>
            <button
              className={`btn btn--sm ${timeRange === 'quarter' ? 'btn--primary' : 'btn--ghost'}`}
              onClick={() => setTimeRange('quarter')}
            >
              This Quarter
            </button>
            <button
              className={`btn btn--sm ${timeRange === 'all-time' ? 'btn--primary' : 'btn--ghost'}`}
              onClick={() => setTimeRange('all-time')}
            >
              All Time
            </button>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart">
            {monthlyBreakdown.map(item => (
              <div key={item.month} className="chart-column">
                <div className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{ height: `${(item.amount / maxAmount) * 100}%` }}
                  >
                    <span className="chart-bar__label">${item.amount / 1000}k</span>
                  </div>
                </div>
                <div className="chart-month">{item.month}</div>
                <div className="chart-loads">{item.loads} loads</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Loads */}
      <div className="top-loads-section">
        <h2>Top Earning Loads</h2>
        <div className="top-loads-list">
          {topLoads.map((load, idx) => (
            <div key={load.id} className="top-load-item">
              <div className="top-load-rank">#{idx + 1}</div>
              <div className="top-load-info">
                <div className="top-load-route">
                  {load.pickup} → {load.delivery}
                </div>
                <div className="top-load-date">{new Date(load.date).toLocaleDateString()}</div>
              </div>
              <div className="top-load-amount">${load.amount}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="payment-history-section">
        <h2>Payment Schedule</h2>
        <div className="payment-schedule">
          <div className="payment-item">
            <div className="payment-info">
              <div className="payment-label">Next Payment</div>
              <div className="payment-date">May 5, 2026</div>
            </div>
            <div className="payment-amount">$1,200</div>
          </div>
          <div className="payment-item">
            <div className="payment-info">
              <div className="payment-label">Last Payment</div>
              <div className="payment-date">April 20, 2026</div>
            </div>
            <div className="payment-amount">$3,200</div>
          </div>
          <div className="payment-item">
            <div className="payment-info">
              <div className="payment-label">Previous Payment</div>
              <div className="payment-date">March 20, 2026</div>
            </div>
            <div className="payment-amount">$3,100</div>
          </div>
        </div>

        <div className="payment-info-box">
          <h3>Payment Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Payment Method</span>
              <span className="info-value">Direct Deposit</span>
            </div>
            <div className="info-item">
              <span className="info-label">Account</span>
              <span className="info-value">****5432</span>
            </div>
            <div className="info-item">
              <span className="info-label">Payment Day</span>
              <span className="info-value">5th of each month</span>
            </div>
            <div className="info-item">
              <span className="info-label">Tax ID</span>
              <span className="info-value">****8765</span>
            </div>
          </div>
          <button className="btn btn--primary btn--sm">
            Update Payment Info
          </button>
        </div>
      </div>

      {/* Earnings Tips */}
      <div className="earnings-tips">
        <h2>Maximize Your Earnings</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🎯</div>
            <h3>Accept More Loads</h3>
            <p>Increase your acceptance rate to get higher-value loads first</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">⭐</div>
            <h3>Improve Your Rating</h3>
            <p>Complete loads on time and maintain high quality to unlock premium routes</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📚</div>
            <h3>Learn Our System</h3>
            <p>Browse our help articles to optimize your earnings</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📞</div>
            <h3>Contact Support</h3>
            <p>Have questions about your earnings? Our team is here to help</p>
          </div>
        </div>
      </div>
    </div>
  )
}
