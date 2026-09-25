const mongoose = require("mongoose")
const { databaseUrl } = require("../config")

const connectDatabse = () => {
  try {
    mongoose.connect(databaseUrl)
    console.log("Database connected successfully")
  } catch (error) {
    console.log("Database connection failed", error.message)
  }
}

module.exports = connectDatabse
