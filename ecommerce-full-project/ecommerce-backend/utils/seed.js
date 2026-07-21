// Run with: npm run seed
// Populates the database with a demo admin user, categories, and products.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { categoryData, productData } = require('./sampleData');

const seed = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany()]);

  console.log('Creating admin user...');
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  });

  console.log('Creating demo customer...');
  await User.create({
    name: 'Demo Customer',
    email: 'customer@example.com',
    password: 'customer123',
    role: 'customer',
  });

  console.log('Creating categories...');
  const categories = await Category.insertMany(categoryData);

  console.log('Creating products...');
  const products = productData(categories, admin._id);
  await Product.insertMany(products);

  console.log('Seed complete!');
  console.log('Admin login: admin@example.com / admin123');
  console.log('Customer login: customer@example.com / customer123');

  mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
