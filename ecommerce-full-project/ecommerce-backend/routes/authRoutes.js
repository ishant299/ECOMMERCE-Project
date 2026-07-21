const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');
const { register, login, logout, getMe, updateMe } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone')
      .optional({ values: 'falsy' })
      .matches(/^\d{10}$/)
      .withMessage('Phone must be exactly 10 digits'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('credential')
      .trim()
      .notEmpty()
      .withMessage('Email, User ID, or Mobile number is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

module.exports = router;
