require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Delete all users
    await User.deleteMany({});
    console.log('All existing users deleted.');

    // Create admin account
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);
    
    const adminUser = new User({
      phone: '1234567890',
      password: hashedPassword,
      fullName: 'Quản trị viên',
      role: 'admin'
    });
    
    await adminUser.save();
    console.log('Admin account created: 1234567890 / 123456');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
