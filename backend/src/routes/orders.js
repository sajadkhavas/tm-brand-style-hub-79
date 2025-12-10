const express = require('express');
const { Order, User } = require('../models');
const { verifyToken, optionalAuth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Generate order number
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TM${year}${month}${day}-${random}`;
};

// Create order (can be guest or authenticated)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      shippingCost = 0,
      discountAmount = 0,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      paymentMethod,
      notes
    } = req.body;

    // Validation
    if (!items || !items.length) {
      return res.status(400).json({ error: 'Order items are required' });
    }
    if (!customerName || !customerPhone) {
      return res.status(400).json({ error: 'Customer name and phone are required' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      items,
      totalAmount,
      shippingCost,
      discountAmount,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      paymentMethod,
      notes,
      userId: req.user?.id || null
    });

    res.status(201).json({
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user's orders (authenticated)
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({ data: orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order by order number
router.get('/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { orderNumber: req.params.orderNumber }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ data: order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
