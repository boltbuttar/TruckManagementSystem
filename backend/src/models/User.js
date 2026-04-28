const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name:      { type: String,  required: true, trim: true },
  email:     { type: String,  required: true, unique: true, lowercase: true },
  password:  { type: String,  required: true, minlength: 8, select: false },
  phone:     { type: String },
  role:      { type: String,  enum: ['driver','admin','company'], default: 'driver' },
  cdl:       { type: String },
  cdlNumber: { type: String },
  state:     { type: String },
  truckType: { type: String },
  truckMake: { type: String },
  truckModel:{ type: String },
  truckYear: { type: Number },
  homeState: { type: String },
  status:    { type: String,  enum: ['Active','On Duty','Inactive'], default: 'Active' },
  available: { type: Boolean, default: true },
  rating:    { type: Number, default: 5 },
  completedLoads: { type: Number, default: 0 },
  earnings:  { type: Number, default: 0 },
  totalLoads:{ type: Number,  default: 0 },
  isVerified:{ type: Boolean, default: false },
}, { timestamps: true })

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Instance method – compare password
UserSchema.methods.comparePassword = async function (plainText) {
  return bcrypt.compare(plainText, this.password)
}

module.exports = mongoose.model('User', UserSchema)
