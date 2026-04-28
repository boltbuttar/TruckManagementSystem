const Quote = require('../models/Quote')

// Pricing engine helper
const calculateQuote = (pickup, delivery, weight = 20000) => {
  const ratePerMile = 2.5
  const estimatedMiles = Math.floor(Math.random() * 1500) + 400
  const estimatedPrice = parseFloat((estimatedMiles * ratePerMile + weight * 0.002).toFixed(2))
  const transitDays    = Math.ceil(estimatedMiles / 500)
  return { estimatedMiles, estimatedPrice, transitDays }
}

// GET /api/quotes
const getQuotes = async (req, res) => {
  try {
    const { status } = req.query
    const query = status ? { status } : {}
    const quotes = await Quote.find(query).populate('requester', 'name email').sort({ createdAt: -1 })
    res.json({ success: true, count: quotes.length, data: quotes })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/quotes  – submit a quote request
const createQuote = async (req, res) => {
  try {
    const { pickup, delivery, weight, ...rest } = req.body
    const calc = calculateQuote(pickup, delivery, weight)

    const count = await Quote.countDocuments()
    const requestId = `RQ-${String(count + 1000).padStart(4, '0')}`

    const quote = await Quote.create({
      requestId,
      pickup,
      delivery,
      weight,
      ...rest,
      ...calc,
      requester: req.user?._id || null,
    })
    res.status(201).json({ success: true, data: quote })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

// PUT /api/quotes/:id/status
const updateQuoteStatus = async (req, res) => {
  try {
    const { status } = req.body
    const quote = await Quote.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' })
    res.json({ success: true, data: quote })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

// DELETE /api/quotes/:id
const deleteQuote = async (req, res) => {
  try {
    await Quote.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Quote removed' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getQuotes, createQuote, updateQuoteStatus, deleteQuote }
