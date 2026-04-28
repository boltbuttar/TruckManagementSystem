const router = require('express').Router()
const {
  getAllDispatch,
  getDispatchById,
  updateDispatchStep,
  getStatusHistory
} = require('../controllers/index')
const { protect } = require('../middleware/auth')
const { roleCheck } = require('../middleware/roleCheck')

// Get all dispatch loads
router.get('/', getAllDispatch)

// Get single dispatch load
router.get('/:id', getDispatchById)

// Update dispatch step (admin only)
router.patch('/:id/step', protect, roleCheck('admin'), updateDispatchStep)

// Get status history
router.get('/:id/history', getStatusHistory)

module.exports = router
