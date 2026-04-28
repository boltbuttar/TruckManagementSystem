const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not set')
    }

    const conn = await mongoose.connect(mongoUri)
    console.log(`✅  MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(`❌  MongoDB connection failed: ${err.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
