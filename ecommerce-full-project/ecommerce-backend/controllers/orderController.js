const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

const VALID_PAYMENT_METHODS = ['cod', 'online'];

const normalizeOrderItems = (items) => {
  const merged = new Map();

  items.forEach((item) => {
    const productId = item.product?.toString();
    const quantity = Number(item.quantity);

    if (!mongoose.Types.ObjectId.isValid(productId) || !Number.isInteger(quantity) || quantity < 1) {
      throw new Error('Each order item must include a valid product and quantity');
    }

    merged.set(productId, (merged.get(productId) || 0) + quantity);
  });

  return Array.from(merged, ([product, quantity]) => ({ product, quantity }));
};

const restockProducts = async (items) => {
  await Promise.all(
    items.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
        status: 'active',
      })
    )
  );
};

// @desc    Place a new order (checkout)
// @route   POST /api/orders
// @access  Private/Customer
const placeOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }
  if (!shippingAddress) {
    res.status(400);
    throw new Error('Shipping address is required');
  }
  if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    res.status(400);
    throw new Error(`Payment method must be one of: ${VALID_PAYMENT_METHODS.join(', ')}`);
  }

  const normalizedItems = normalizeOrderItems(items);
  const decrementedItems = [];

  try {
    let itemsPrice = 0;
    const orderItems = [];

    for (const item of normalizedItems) {
      const product = await Product.findOneAndUpdate(
        {
          _id: item.product,
          stock: { $gte: item.quantity },
          status: { $ne: 'inactive' },
        },
        { $inc: { stock: -item.quantity } },
        { new: true, runValidators: true }
      );

      if (!product) {
        const existingProduct = await Product.findById(item.product);
        throw new Error(
          existingProduct
            ? `Insufficient stock for "${existingProduct.name}" (available: ${existingProduct.stock})`
            : `Product not found: ${item.product}`
        );
      }

      decrementedItems.push(item);
      if (product.stock === 0 && product.status !== 'out_of_stock') {
        product.status = 'out_of_stock';
        await product.save();
      }

      itemsPrice += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
        quantity: item.quantity,
      });
    }

    const shippingPrice = itemsPrice > 500 ? 0 : 49; // simple flat-rate example
    const totalPrice = itemsPrice + shippingPrice;

    const order = await Order.create({
      user: req.user._id,
      customerInfo: {
        name: req.user.name,
        email: req.user.email,
        phone: shippingAddress.phone || req.user.phone,
      },
      items: orderItems,
      shippingAddress,
      paymentMethod,
      isPaid: paymentMethod === 'online',
      paidAt: paymentMethod === 'online' ? new Date() : undefined,
      itemsPrice,
      shippingPrice,
      totalPrice,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: order,
    });
  } catch (error) {
    if (decrementedItems.length > 0) {
      await restockProducts(decrementedItems);
    }
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
// @access  Private/Customer
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, data: orders });
});

// @desc    Get single order (owner or admin only)
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, data: order });
});

// @desc    Get all orders (with optional status filter + pagination)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: orders.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    data: orders,
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  if (status === 'delivered') order.deliveredAt = new Date();
  if (status === 'cancelled') order.cancelledAt = new Date();

  const updated = await order.save();
  res.json({ success: true, data: updated });
});

// @desc    Cancel an order (restocks items)
// @route   PUT /api/orders/:id/cancel
// @access  Private/Admin
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.status === 'delivered') {
    res.status(400);
    throw new Error('Cannot cancel an order that has already been delivered');
  }

  // Restock items
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
      status: 'active',
    });
  }

  order.status = 'cancelled';
  order.cancelledAt = new Date();
  const updated = await order.save();

  res.json({ success: true, data: updated });
});

module.exports = {
  placeOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
