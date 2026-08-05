const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ql_benhvien').then(async () => {
  const users = await mongoose.connection.db.collection('users').find({ phone: { $exists: false } }).toArray();
  for (let i = 0; i < users.length; i++) {
    await mongoose.connection.db.collection('users').updateOne(
      { _id: users[i]._id },
      { $set: { phone: '090' + Math.floor(1000000 + Math.random() * 9000000) } }
    );
  }
  console.log('Updated existing users with mock phones');
  process.exit(0);
});
