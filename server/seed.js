/**
 * Creates (or updates) the default admin account defined in .env
 * Run with: node seed.js
 */
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const mongoose = require('mongoose');

const run = async () => {
  await connectDB();

  const name = process.env.ADMIN_NAME || 'Admin';
  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'change_this_password';

  let admin = await User.findOne({ email });

  if (admin) {
    admin.name = name;
    admin.password = password;
    admin.role = 'admin';
    await admin.save();
    console.log(`Updated existing admin: ${email}`);
  } else {
    admin = await User.create({ name, email, password, role: 'admin' });
    console.log(`Created admin user: ${email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
