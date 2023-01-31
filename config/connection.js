
const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);


// This can be used to log mongo queries that are being executed!
mongoose.set("debug", true);

module.exports = mongoose.connection;
