const User = require('../models/User')
const jwt  = require('jsonwebtoken')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

// @desc  Register a new user/driver
// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, cdlNumber, truckType, homeState } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' })

    const user = await User.create({ name, email, password, phone, role: role || 'driver', cdlNumber, truckType, homeState })
    const token = signToken(user._id)

    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @desc  Login
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' })

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const token = signToken(user._id)
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @desc  Get current user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user })
}

module.exports = { register, login, getMe }
