const mongoose = require('mongoose')

const LoadSchema = new mongoose.Schema({
  loadId:       { type: String, unique: true },
  pickup:       { type: mongoose.Schema.Types.Mixed, required: true },
  delivery:     { type: mongoose.Schema.Types.Mixed, required: true },
  pickupDate:   { type: Date },
  deliveryDate: { type: Date },
  cargo:        { type: String },
  cargoType:    { type: String, required: true },
  truckType:    { type: String },
  weight:       { type: Number },
  amount:       { type: Number, default: 0 },
  distance:     { type: Number, default: 0 },
  specialNotes: { type: String },
  driver:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  requestedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['Pending','Assigned','In Transit','Out for Delivery','Delivered','Cancelled'],
    default: 'Pending'
  },
  dispatchStep: { type: Number, default: 0, min: 0, max: 5 },
  quote:        { type: mongoose.Schema.Types.ObjectId, ref: 'Quote' },
}, { timestamps: true })

// Auto-generate load ID
LoadSchema.pre('save', async function (next) {
  if (!this.loadId) {
    const count = await mongoose.model('Load').countDocuments()
    this.loadId = `TF-${String(count + 1000).padStart(4, '0')}`
  }
  next()
})

module.exports = mongoose.model('Load', LoadSchema)
