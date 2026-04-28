const User = require('../models/User');
const Load = require('../models/Load');
const Quote = require('../models/Quote');
const Dispatch = require('../models/Dispatch');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

// ====================== AUTH CONTROLLERS ======================

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      status: 'Active',
      available: role === 'driver' ? true : undefined,
      rating: role === 'driver' ? 5.0 : undefined,
      completedLoads: role === 'driver' ? 0 : undefined
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        available: user.available,
        rating: user.rating
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        available: user.available,
        rating: user.rating,
        completedLoads: user.completedLoads,
        cdl: user.cdl,
        truckMake: user.truckMake,
        truckModel: user.truckModel,
        truckYear: user.truckYear,
        licenseExpiry: user.licenseExpiry
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== DRIVER CONTROLLERS ======================

const getAllDrivers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const drivers = await User.find({ role: 'driver' })
      .select('-password')
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await User.countDocuments({ role: 'driver' });

    const formattedDrivers = drivers.map(d => ({
      id: d._id,
      name: d.name,
      email: d.email,
      phone: d.phone,
      cdl: d.cdl,
      truckMake: d.truckMake,
      truckModel: d.truckModel,
      truckYear: d.truckYear,
      status: d.status,
      available: d.available,
      rating: d.rating,
      completedLoads: d.completedLoads,
      licenseExpiry: d.licenseExpiry
    }));

    res.json({
      success: true,
      data: formattedDrivers,
      total,
      page,
      limit
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDriverById = async (req, res) => {
  try {
    const driver = await User.findOne({ _id: req.params.id, role: 'driver' })
      .select('-password')
      .lean();

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    res.json({
      success: true,
      data: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        cdl: driver.cdl,
        truckMake: driver.truckMake,
        truckModel: driver.truckModel,
        truckYear: driver.truckYear,
        status: driver.status,
        available: driver.available,
        rating: driver.rating,
        completedLoads: driver.completedLoads,
        licenseExpiry: driver.licenseExpiry
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createDriver = async (req, res) => {
  try {
    const { name, email, password, phone, cdl, truckMake, truckModel, truckYear, licenseExpiry } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newDriver = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'driver',
      cdl,
      truckMake,
      truckModel,
      truckYear,
      licenseExpiry,
      status: 'Active',
      available: true,
      rating: 5.0,
      completedLoads: 0
    });

    await newDriver.save();

    res.status(201).json({
      success: true,
      message: 'Driver created successfully',
      data: {
        id: newDriver._id,
        name: newDriver.name,
        email: newDriver.email,
        phone: newDriver.phone,
        cdl: newDriver.cdl,
        truckMake: newDriver.truckMake,
        status: newDriver.status,
        available: newDriver.available,
        rating: newDriver.rating
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateDriver = async (req, res) => {
  try {
    const { name, phone, cdl, truckMake, truckModel, truckYear, licenseExpiry, status, available } = req.body;

    const driver = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, cdl, truckMake, truckModel, truckYear, licenseExpiry, status, available },
      { new: true, runValidators: true }
    ).select('-password');

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    res.json({
      success: true,
      message: 'Driver updated successfully',
      data: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        cdl: driver.cdl,
        status: driver.status,
        available: driver.available,
        rating: driver.rating
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDriver = async (req, res) => {
  try {
    const driver = await User.findByIdAndDelete(req.params.id);

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    res.json({
      success: true,
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver', available: true })
      .select('-password')
      .lean();

    const formattedDrivers = drivers.map(d => ({
      id: d._id,
      name: d.name,
      email: d.email,
      phone: d.phone,
      rating: d.rating,
      available: d.available
    }));

    res.json({
      success: true,
      data: formattedDrivers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const { available } = req.body;

    const driver = await User.findByIdAndUpdate(
      req.params.id,
      { available },
      { new: true, runValidators: true }
    ).select('-password');

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: {
        id: driver._id,
        name: driver.name,
        available: driver.available
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== LOAD CONTROLLERS ======================

const getAllLoads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = status ? { status } : {};
    const loads = await Load.find(filter)
      .populate('driver', 'name email phone rating')
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Load.countDocuments(filter);

    const formattedLoads = loads.map(l => ({
      id: l._id,
      loadId: l.loadId,
      pickup: l.pickup,
      delivery: l.delivery,
      cargoType: l.cargoType,
      truckType: l.truckType,
      weight: l.weight,
      amount: l.amount,
      distance: l.distance,
      status: l.status,
      driverId: l.driver?._id,
      driver: l.driver,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt
    }));

    res.json({
      success: true,
      data: formattedLoads,
      total,
      page,
      limit
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLoadById = async (req, res) => {
  try {
    const load = await Load.findById(req.params.id)
      .populate('driver', 'name email phone rating available')
      .lean();

    if (!load) {
      return res.status(404).json({ success: false, message: 'Load not found' });
    }

    res.json({
      success: true,
      data: {
        id: load._id,
        loadId: load.loadId,
        pickup: load.pickup,
        delivery: load.delivery,
        cargoType: load.cargoType,
        truckType: load.truckType,
        weight: load.weight,
        amount: load.amount,
        distance: load.distance,
        status: load.status,
        driver: load.driver,
        createdAt: load.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createLoad = async (req, res) => {
  try {
    const { loadId, pickup, delivery, cargoType, truckType, weight, amount, distance } = req.body;

    const newLoad = new Load({
      loadId,
      pickup,
      delivery,
      cargoType,
      truckType,
      weight,
      amount,
      distance,
      status: 'Available'
    });

    await newLoad.save();

    res.status(201).json({
      success: true,
      message: 'Load created successfully',
      data: {
        id: newLoad._id,
        loadId: newLoad.loadId,
        pickup: newLoad.pickup,
        delivery: newLoad.delivery,
        status: newLoad.status,
        amount: newLoad.amount,
        distance: newLoad.distance
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;

    const load = await Load.findByIdAndUpdate(
      req.params.id,
      { driver: driverId, status: 'Assigned' },
      { new: true }
    ).populate('driver', 'name email phone');

    if (!load) {
      return res.status(404).json({ success: false, message: 'Load not found' });
    }

    res.json({
      success: true,
      message: 'Driver assigned successfully',
      data: {
        id: load._id,
        loadId: load.loadId,
        status: load.status,
        driver: load.driver
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateLoadStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const load = await Load.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('driver', 'name email rating');

    if (!load) {
      return res.status(404).json({ success: false, message: 'Load not found' });
    }

    res.json({
      success: true,
      message: 'Load status updated successfully',
      data: {
        id: load._id,
        loadId: load.loadId,
        status: load.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteLoad = async (req, res) => {
  try {
    const load = await Load.findByIdAndDelete(req.params.id);

    if (!load) {
      return res.status(404).json({ success: false, message: 'Load not found' });
    }

    res.json({
      success: true,
      message: 'Load deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateLoad = async (req, res) => {
  try {
    const { pickup, delivery, cargoType, weight, amount, distance, status } = req.body;

    const load = await Load.findByIdAndUpdate(
      req.params.id,
      { pickup, delivery, cargoType, weight, amount, distance, status },
      { new: true, runValidators: true }
    );

    if (!load) {
      return res.status(404).json({ success: false, message: 'Load not found' });
    }

    res.json({
      success: true,
      message: 'Load updated successfully',
      data: {
        id: load._id,
        loadId: load.loadId,
        status: load.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDriverLoads = async (req, res) => {
  try {
    const driverId = req.params.driverId;

    const loads = await Load.find({ driver: driverId })
      .populate('driver', 'name email phone rating')
      .lean();

    res.json({
      success: true,
      data: loads
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== QUOTE CONTROLLERS ======================

const getAvailableQuotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const quotes = await Quote.find({ status: 'Pending' })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Quote.countDocuments({ status: 'Pending' });

    res.json({
      success: true,
      data: quotes,
      total,
      page,
      limit
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllQuotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = status ? { status } : {};
    const quotes = await Quote.find(filter)
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Quote.countDocuments(filter);

    res.json({
      success: true,
      data: quotes,
      total,
      page,
      limit
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id).lean();

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    res.json({
      success: true,
      data: quote
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const calculateQuote = async (req, res) => {
  try {
    const { pickup, delivery, weight } = req.body;

    // Simple calculation: $1.50 per mile, plus $50 base + weight premium
    const estimatedMiles = Math.random() * 500 + 50;
    const baseFee = 50;
    const mileRate = 1.5;
    const weightPremium = weight > 5000 ? (weight - 5000) * 0.01 : 0;
    const estimatedPrice = baseFee + (estimatedMiles * mileRate) + weightPremium;

    res.json({
      success: true,
      data: {
        estimatedMiles: Math.round(estimatedMiles),
        estimatedPrice: Math.round(estimatedPrice * 100) / 100,
        transitDays: Math.ceil(estimatedMiles / 500)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitQuote = async (req, res) => {
  try {
    const { requestId, pickup, delivery, cargoType, weight, contactName, contactEmail, contactPhone, company, estimatedMiles, estimatedPrice, transitDays } = req.body;

    const newQuote = new Quote({
      requestId,
      requester: req.user.id,
      pickup,
      delivery,
      cargoType,
      weight,
      contactName,
      contactEmail,
      contactPhone,
      company,
      estimatedMiles,
      estimatedPrice,
      transitDays,
      status: 'Pending'
    });

    await newQuote.save();

    res.status(201).json({
      success: true,
      message: 'Quote submitted successfully',
      data: {
        id: newQuote._id,
        requestId: newQuote.requestId,
        estimatedPrice: newQuote.estimatedPrice,
        transitDays: newQuote.transitDays,
        status: newQuote.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const respondToQuote = async (req, res) => {
  try {
    const { response } = req.body; // 'accepted' or 'rejected'

    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      { status: response === 'accepted' ? 'Accepted' : 'Rejected', respondedAt: new Date() },
      { new: true }
    );

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    res.json({
      success: true,
      message: `Quote ${response} successfully`,
      data: {
        id: quote._id,
        status: quote.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getQuoteHistory = async (req, res) => {
  try {
    const quotes = await Quote.find({ requester: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: quotes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== DISPATCH CONTROLLERS ======================

const getAllDispatch = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const dispatches = await Dispatch.find()
      .populate('load', 'loadId pickup delivery')
      .populate('driver', 'name email phone')
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Dispatch.countDocuments();

    res.json({
      success: true,
      data: dispatches,
      total,
      page,
      limit
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createDispatch = async (req, res) => {
  try {
    const { loadId, driverId } = req.body;

    const newDispatch = new Dispatch({
      load: loadId,
      driver: driverId,
      currentStep: 0,
      timeline: [
        { step: 0, status: 'Assigned', timestamp: new Date() }
      ]
    });

    await newDispatch.save();

    res.status(201).json({
      success: true,
      message: 'Dispatch created successfully',
      data: {
        id: newDispatch._id,
        load: loadId,
        driver: driverId,
        status: 'Assigned'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDispatchById = async (req, res) => {
  try {
    const dispatch = await Dispatch.findById(req.params.id)
      .populate('load', 'loadId pickup delivery')
      .populate('driver', 'name email phone')
      .lean();

    if (!dispatch) {
      return res.status(404).json({ success: false, message: 'Dispatch not found' });
    }

    res.json({
      success: true,
      data: dispatch
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateDispatchStep = async (req, res) => {
  try {
    const { step, status } = req.body;

    const dispatch = await Dispatch.findByIdAndUpdate(
      req.params.id,
      {
        $push: { timeline: { step, status, timestamp: new Date() } },
        currentStep: step
      },
      { new: true }
    ).populate('load', 'loadId pickup delivery')
      .populate('driver', 'name email');

    if (!dispatch) {
      return res.status(404).json({ success: false, message: 'Dispatch not found' });
    }

    res.json({
      success: true,
      message: 'Dispatch step updated',
      data: {
        id: dispatch._id,
        currentStep: dispatch.currentStep,
        timeline: dispatch.timeline
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStatusHistory = async (req, res) => {
  try {
    const dispatch = await Dispatch.findById(req.params.id)
      .select('timeline')
      .lean();

    if (!dispatch) {
      return res.status(404).json({ success: false, message: 'Dispatch not found' });
    }

    res.json({
      success: true,
      data: {
        id: dispatch._id,
        timeline: dispatch.timeline
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== ANALYTICS CONTROLLERS ======================

const getDashboardAnalytics = async (req, res) => {
  try {
    const totalLoads = await Load.countDocuments();
    const completedLoads = await Load.countDocuments({ status: 'Completed' });
    const totalDrivers = await User.countDocuments({ role: 'driver' });
    const availableDrivers = await User.countDocuments({ role: 'driver', available: true });

    // Calculate revenue from completed loads
    const completedData = await Load.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);

    const totalRevenue = completedData[0]?.totalRevenue || 0;

    // Recent activity
    const recentLoads = await Load.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('driver', 'name')
      .lean();

    const recentActivity = recentLoads.map(l => ({
      id: l._id,
      type: 'Load Assignment',
      description: `Load ${l.loadId} assigned to ${l.driver?.name || 'Unassigned'}`,
      timestamp: l.createdAt,
      status: l.status
    }));

    res.json({
      success: true,
      data: {
        kpis: {
          totalLoads,
          completedLoads,
          totalDrivers,
          availableDrivers,
          totalRevenue
        },
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDriverStats = async (req, res) => {
  try {
    const driverId = req.params.driverId;

    const driver = await User.findById(driverId).lean();
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    const loadsCompleted = await Load.countDocuments({ driver: driverId, status: 'Completed' });
    const loadsInProgress = await Load.countDocuments({ driver: driverId, status: 'InTransit' });

    const revenueData = await Load.aggregate([
      { $match: { driver: require('mongoose').Types.ObjectId(driverId), status: 'Completed' } },
      { $group: { _id: null, totalEarnings: { $sum: '$amount' } } }
    ]);

    const totalEarnings = revenueData[0]?.totalEarnings || 0;

    res.json({
      success: true,
      data: {
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        rating: driver.rating,
        completedLoads: driver.completedLoads,
        loadsInProgress,
        totalEarnings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  // Auth
  register,
  login,
  getMe,
  // Drivers
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getAvailableDrivers,
  updateAvailability,
  // Loads
  getAllLoads,
  getLoadById,
  createLoad,
  updateLoad,
  assignDriver,
  updateLoadStatus,
  deleteLoad,
  getDriverLoads,
  // Quotes
  getAvailableQuotes,
  getAllQuotes,
  getQuoteById,
  calculateQuote,
  submitQuote,
  respondToQuote,
  getQuoteHistory,
  // Dispatch
  getAllDispatch,
  getDispatchById,
  createDispatch,
  updateDispatchStep,
  getStatusHistory,
  // Analytics
  getDashboardAnalytics,
  getDriverStats
};
