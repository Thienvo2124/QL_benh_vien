const mongoose = require('c:/Users/ADMIN/Documents/GitHub/QL_benh_vien/backend/node_modules/mongoose');
const dotenv = require('c:/Users/ADMIN/Documents/GitHub/QL_benh_vien/backend/node_modules/dotenv');

const envPath = 'c:/Users/ADMIN/Documents/GitHub/QL_benh_vien/backend/.env';
dotenv.config({ path: envPath });

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/ql_benh_vien";

mongoose.connect(mongoURI)
  .then(async () => {
    const appointments = await mongoose.connection.db.collection('appointments').find({}).toArray();
    console.log("ALL APPOINTMENTS IN DB WITH DATES:");
    appointments.forEach(app => {
      console.log({
        id: app._id,
        name: app.name,
        phone: app.phone,
        status: app.status,
        paymentStatus: app.paymentStatus,
        queueNumber: app.queueNumber,
        dept: app.dept,
        date: app.date,
        createdAt: app.createdAt
      });
    });
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
