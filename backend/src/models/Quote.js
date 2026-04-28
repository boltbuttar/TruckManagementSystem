const mongoose = require('mongoose')

const QuoteSchema = new mongoose.Schema({
  requestId:    { type: String, unique: true },
  requester:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickup:       { type: mongoose.Schema.Types.Mixed, required: true },
  delivery:     { type: mongoose.Schema.Types.Mixed, required: true },
  pickupDate:   { type: Date },
  cargoType:    { type: String },
  truckType:    { type: String },
  weight:       { type: Number },
  specialNotes: { type: String },
  // Contact info (for guest submissions)
  contactName:  { type: String },
  contactEmail: { type: String },
  contactPhone: { type: String },
  company:      { type: String },
  // Quote result
  distance:       { type: Number },
  estimatedMiles: { type: Number },
  price:          { type: Number },
  estimatedPrice: { type: Number },
  transitDays:    { type: Number },
  status: {
    type: String,
    enum: ['Pending','Quoted','Accepted','Rejected'],
    default: 'Pending'
  },
}, { timestamps: true })

module.exports = mongoose.model('Quote', QuoteSchema)
