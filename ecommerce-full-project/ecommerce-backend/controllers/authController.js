const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const buildBaseUserId = (name = '', email = '') => {
  const normalizedName = name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9._-]/g, '');
  const normalizedEmail = email.split('@')[0]?.toLowerCase().replace(/[^a-z0-9._-]/g, '') || '';
  const fallback = normalizedName || normalizedEmail || 'user';
  const trimmed = fallback.replace(/^[._-]+|[._-]+$/g, '');
  const safeBase = (trimmed || 'user').slice(0, 20);

  if (safeBase.length >= 3) return safeBase;
  return `${safeBase}user`.slice(0, 20);
};

const generateUniqueUserId = async (name, email) => {
  const baseUserId = buildBaseUserId(name, email);
  let userId = baseUserId;
  let counter = 1;

  while (await User.findOne({ userId })) {
    const suffix = `${counter}`;
    const prefixLength = Math.max(3, 20 - suffix.length);
    userId = `${baseUserId.slice(0, prefixLength)}${suffix}`;
    counter += 1;
  }

  return userId;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedPhone = phone?.trim() || undefined;

  const userExists = await User.findOne({
    $or: [{ email: normalizedEmail }, ...(normalizedPhone ? [{ phone: normalizedPhone }] : [])],
  });

  if (userExists) {
    res.status(400);
    throw new Error('An account with this email or phone already exists');
  }

  const userId = await generateUniqueUserId(name, normalizedEmail);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    phone: normalizedPhone,
    userId,
    role: 'customer',
  });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      userId: user.userId,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { credential, password } = req.body;

  if (!credential || !password) {
    res.status(400);
    throw new Error('Email/User ID/Mobile and password are required');
  }

  const normalizedCredential = credential.toLowerCase().trim();

  const user = await User.findOne({
    $or: [{ email: normalizedCredential }, { userId: normalizedCredential }, { phone: credential.trim() }],
  }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials. Please check your email, user ID, mobile number, or password.');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('Account has been deactivated');
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      userId: user.userId,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    },
  });
});

// @desc    Logout (client discards token; endpoint provided for completeness)
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get current logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

// @desc    Update current user's profile
// @route   PUT /api/auth/me
// @access  Private
const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;

  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (address) user.address = address;

  const updated = await user.save();
  res.json({ success: true, data: updated });
});

module.exports = { register, login, logout, getMe, updateMe };
