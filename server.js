
const express = require("express");
const db = require("./config/connection");
const routes = require("./routes");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

console.log("ENV",process.env.MONGODB_URL)
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});