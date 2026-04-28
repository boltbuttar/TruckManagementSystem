/**
 * Database Seed Script - Populate MongoDB with sample data
 * Run with: node src/seed.js
 */

require('dotenv').config()
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const User = require('./models/User')
const Load = require('./models/Load')
const Quote = require('./models/Quote')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected for seeding')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    process.exit(1)
  }
}

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({})
    await Load.deleteMany({})
    await Quote.deleteMany({})
    console.log('🗑️  Cleared existing data')

    // Create admin users
    const adminPassword = await bcryptjs.hash('admin123', 10)
    const drivers = [
      {
        name: 'Muhammad Ali Hassan',
        email: 'ali.hassan@tdms.pk',
        password: adminPassword,
        phone: '+92-300-1234567',
        role: 'driver',
        cdl: 'CDL-PK-001',
        truckMake: 'Hino',
        truckModel: 'Ranger',
        truckYear: 2022,
        licenseExpiry: new Date('2027-12-31'),
        status: 'Active',
        available: true,
        rating: 4.8,
        completedLoads: 45
      },
      {
        name: 'Fatima Khan',
        email: 'fatima.khan@tdms.pk',
        password: adminPassword,
        phone: '+92-300-2345678',
        role: 'driver',
        cdl: 'CDL-PK-002',
        truckMake: 'Sinotruck',
        truckModel: 'Howo',
        truckYear: 2023,
        licenseExpiry: new Date('2028-06-30'),
        status: 'Active',
        available: true,
        rating: 4.9,
        completedLoads: 52
      },
      {
        name: 'Ahmed Ibrahim Sheikh',
        email: 'ahmed.sheikh@tdms.pk',
        password: adminPassword,
        phone: '+92-300-3456789',
        role: 'driver',
        cdl: 'CDL-PK-003',
        truckMake: 'Volvo',
        truckModel: 'FM',
        truckYear: 2021,
        licenseExpiry: new Date('2026-09-15'),
        status: 'Active',
        available: false,
        rating: 4.7,
        completedLoads: 38
      },
      {
        name: 'Zainab Malik',
        email: 'zainab.malik@tdms.pk',
        password: adminPassword,
        phone: '+92-300-4567890',
        role: 'driver',
        cdl: 'CDL-PK-004',
        truckMake: 'FAW',
        truckModel: 'Jiefang',
        truckYear: 2022,
        licenseExpiry: new Date('2027-03-20'),
        status: 'Active',
        available: true,
        rating: 4.6,
        completedLoads: 31
      },
      {
        name: 'Hassan Raza',
        email: 'hassan.raza@tdms.pk',
        password: adminPassword,
        phone: '+92-300-5678901',
        role: 'driver',
        cdl: 'CDL-PK-005',
        truckMake: 'Isuzu',
        truckModel: 'ELF',
        truckYear: 2020,
        licenseExpiry: new Date('2025-11-10'),
        status: 'Active',
        available: true,
        rating: 4.5,
        completedLoads: 27
      }
    ]

    const createdDrivers = await User.insertMany(drivers)
    console.log(`✅ Created ${createdDrivers.length} drivers with Pakistani names`)

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@tdms.pk',
      password: adminPassword,
      phone: '+92-300-0000000',
      role: 'admin',
      status: 'Active'
    })
    await adminUser.save()
    console.log('✅ Created admin user')

    // Create company user
    const companyUser = new User({
      name: 'Company Manager',
      email: 'company@tdms.pk',
      password: adminPassword,
      phone: '+92-300-0000001',
      role: 'company',
      status: 'Active'
    })
    await companyUser.save()
    console.log('✅ Created company user')

    // Create loads with Pakistani cities
    const loads = [
      {
        loadId: 'LOAD-PK-001',
        pickup: {
          city: 'Karachi',
          state: 'Sindh',
          address: 'Port Authority, Karachi',
          zipCode: '74000'
        },
        delivery: {
          city: 'Lahore',
          state: 'Punjab',
          address: '123 Mall Road, Lahore',
          zipCode: '54000'
        },
        cargoType: 'Electronics',
        truckType: 'Dry Van 40\'',
        weight: 18000,
        driver: createdDrivers[0]._id,
        status: 'In Transit',
        amount: 45000,
        distance: 1245
      },
      {
        loadId: 'LOAD-PK-002',
        pickup: {
          city: 'Islamabad',
          state: 'Federal',
          address: 'Industrial Zone, Islamabad',
          zipCode: '44000'
        },
        delivery: {
          city: 'Peshawar',
          state: 'KPK',
          address: 'University Road, Peshawar',
          zipCode: '25000'
        },
        cargoType: 'General Freight',
        truckType: 'Flatbed',
        weight: 22000,
        driver: createdDrivers[1]._id,
        status: 'Pending',
        amount: 38000,
        distance: 180
      },
      {
        loadId: 'LOAD-PK-003',
        pickup: {
          city: 'Faisalabad',
          state: 'Punjab',
          address: 'Factory Zone, Faisalabad',
          zipCode: '38000'
        },
        delivery: {
          city: 'Multan',
          state: 'Punjab',
          address: 'Market Street, Multan',
          zipCode: '60000'
        },
        cargoType: 'Textiles',
        truckType: 'Dry Van 40\'',
        weight: 16000,
        driver: createdDrivers[2]._id,
        status: 'Completed',
        amount: 32000,
        distance: 210
      },
      {
        loadId: 'LOAD-PK-004',
        pickup: {
          city: 'Hyderabad',
          state: 'Sindh',
          address: 'Trading Center, Hyderabad',
          zipCode: '71000'
        },
        delivery: {
          city: 'Sukkur',
          state: 'Sindh',
          address: 'Commercial Hub, Sukkur',
          zipCode: '65200'
        },
        cargoType: 'Machinery',
        truckType: 'Refrigerated',
        weight: 28000,
        driver: createdDrivers[3]._id,
        status: 'In Transit',
        amount: 55000,
        distance: 280
      },
      {
        loadId: 'LOAD-PK-005',
        pickup: {
          city: 'Rawalpindi',
          state: 'Punjab',
          address: 'Supply Depot, Rawalpindi',
          zipCode: '46000'
        },
        delivery: {
          city: 'Sargodha',
          state: 'Punjab',
          address: 'Wheat Market, Sargodha',
          zipCode: '40100'
        },
        cargoType: 'Agricultural Produce',
        truckType: 'Dry Van 40\'',
        weight: 20000,
        driver: createdDrivers[4]._id,
        status: 'Delivered',
        amount: 28000,
        distance: 160
      },
      {
        loadId: 'LOAD-PK-006',
        pickup: {
          city: 'Gujranwala',
          state: 'Punjab',
          address: 'Industrial Park, Gujranwala',
          zipCode: '52000'
        },
        delivery: {
          city: 'Sialkot',
          state: 'Punjab',
          address: 'Export Zone, Sialkot',
          zipCode: '51100'
        },
        cargoType: 'Automotive Parts',
        truckType: 'Flatbed',
        weight: 15000,
        driver: null,
        status: 'Pending',
        amount: 35000,
        distance: 75
      }
    ]

    const createdLoads = await Load.insertMany(loads)
    console.log(`✅ Created ${createdLoads.length} loads with Pakistani cities`)

    console.log('\n✨ Database seeding completed successfully!')
    console.log('\n📊 Sample Data:')
    console.log(`   - Drivers: ${createdDrivers.length} (with Pakistani names)`)
    console.log(`   - Loads: ${createdLoads.length} (Karachi, Lahore, Islamabad, Peshawar, Faisalabad, etc.)`)
    console.log(`   - Admin User: admin@tdms.pk / password: admin123`)
    console.log(`   - Company User: company@tdms.pk / password: admin123`)
    console.log('\n🚀 Try logging in to see the real data in your dashboard!')

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding error:', error)
    process.exit(1)
  }
}

// Run seeding
connectDB().then(() => seedData())
