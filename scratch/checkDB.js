const mongoose = require("mongoose");

const localUri = "mongodb://localhost:27017/ql_benhvien";
const remoteUri = "mongodb+srv://lyquanghau8402_db_user:EntRdYtESGNo8Tze@hospital-cluster.ozqjp3w.mongodb.net/hospital_db?retryWrites=true&w=majority&appName=hospital-cluster";

const check = async (uri, label) => {
  try {
    const conn = await mongoose.createConnection(uri).asPromise();
    const count = await conn.collection("medicines").countDocuments({});
    console.log(`${label}: connected. Medicines count: ${count}`);
    await conn.close();
  } catch (err) {
    console.error(`${label} failed:`, err.message);
  }
};

const run = async () => {
  await check(localUri, "LOCAL DB");
  await check(remoteUri, "REMOTE DB");
  process.exit(0);
};

run();
