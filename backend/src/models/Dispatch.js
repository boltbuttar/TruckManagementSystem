const mongoose = require('mongoose')

const DispatchSchema = new mongoose.Schema({
  load:     { type: mongoose.Schema.Types.ObjectId, ref: 'Load', required: true },
  driver:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timeline: [{
    step:      { type: Number },
    label:     { type: String },
    timestamp: { type: Date, default: Date.now },
    note:      { type: String },
  }],
  currentStep: { type: Number, default: 0 },
  estimatedDelivery: { type: Date },
  actualDelivery:    { type: Date },
}, { timestamps: true })

module.exports = mongoose.model('Dispatch', DispatchSchema)
