const express   = require('express')
const cors      = require('cors')
const dotenv    = require('dotenv')
dotenv.config()

const app = express()

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth',     require('./routes/auth.routes'))
app.use('/api/drivers',  require('./routes/driver.routes'))
app.use('/api/loads',    require('./routes/load.routes'))
app.use('/api/quotes',   require('./routes/quote.routes'))
app.use('/api/dispatch', require('./routes/dispatch.routes'))

// Analytics routes
const { getDashboardAnalytics, getDriverStats } = require('./controllers/index')
app.get('/api/analytics/dashboard', getDashboardAnalytics)
app.get('/api/analytics/drivers/:id', getDriverStats)

// Requests routes (using quotes for now)
app.get('/api/requests', (req, res) => {
  const { getAllQuotes } = require('./controllers/index')
  getAllQuotes(req, res)
})
app.get('/api/requests/:id', (req, res) => {
  const { getQuoteById } = require('./controllers/index')
  getQuoteById(req, res)
})

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }))

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }))

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server Error' })
})

module.exports = app
