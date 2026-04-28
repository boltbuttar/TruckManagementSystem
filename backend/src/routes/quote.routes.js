const router = require('express').Router()
const {
  calculateQuote,
  submitQuote,
  getAllQuotes,
  getQuoteById,
  respondToQuote
} = require('../controllers/index')
const { protect } = require('../middleware/auth')
const { roleCheck } = require('../middleware/roleCheck')

// Calculate quote (no auth needed)
router.post('/calculate', calculateQuote)

// Get all quotes
router.get('/', getAllQuotes)

// Submit quote (no auth needed)
router.post('/', submitQuote)

// Get single quote
router.get('/:id', getQuoteById)

// Respond to quote (admin only)
router.post('/:id/respond', protect, roleCheck('admin'), respondToQuote)

module.exports = router
