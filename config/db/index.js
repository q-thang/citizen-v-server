const mongoose = require("mongoose");

//Connect to database
async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (e) {
    console.log("Fail to connect to MongoDB");
  }
}

module.exports = { connect };
