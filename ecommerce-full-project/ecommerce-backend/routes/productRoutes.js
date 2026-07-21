const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);

const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isMongoId().withMessage('A valid category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'out_of_stock'])
    .withMessage('Status must be active, inactive, or out_of_stock'),
  body('images').optional().isArray().withMessage('Images must be an array of strings'),
];
const productUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Product name is required'),
  body('description').optional().trim().notEmpty().withMessage('Description is required'),
  body('category').optional().isMongoId().withMessage('A valid category is required'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'out_of_stock'])
    .withMessage('Status must be active, inactive, or out_of_stock'),
  body('images').optional().isArray().withMessage('Images must be an array of strings'),
];

router.post('/', protect, authorize('admin'), productValidation, validate, createProduct);
router.put('/:id', protect, authorize('admin'), productUpdateValidation, validate, updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
