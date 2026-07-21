const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { categoryData, productData } = require('./sampleData');

const initSampleData = async () => {
  const admin = await User.findOne({ role: 'admin' });
  const existingAdmin = admin
    ? admin
    : await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        userId: 'admin.user',
        phone: '9999999999',
        role: 'admin',
      });

  const demoCustomer = await User.findOne({ email: 'customer@example.com' });
  if (!demoCustomer) {
    await User.create({
      name: 'Demo Customer',
      email: 'customer@example.com',
      password: 'customer123',
      userId: 'demo.customer',
      phone: '9876543210',
      role: 'customer',
    });
  }

  let categories = await Category.find();
  if (categories.length === 0) {
    categories = await Category.insertMany(categoryData);
    console.log('Sample categories created');
  }

  const sampleProducts = productData(categories, existingAdmin._id);
  const existingProductNames = new Set((await Product.find({}, 'name')).map((product) => product.name));
  const missingProducts = sampleProducts.filter((product) => !existingProductNames.has(product.name));

  if (missingProducts.length > 0) {
    await Product.insertMany(missingProducts);
    console.log(`${missingProducts.length} sample products created`);
  }
};

module.exports = initSampleData;
