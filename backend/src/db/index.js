const mongoose = require("mongoose")
const { databaseUrl } = require("../config")

const connectDatabase = async () => {
  try {
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not defined in environment variables.")
    }

    const conn = await mongoose.connect(databaseUrl, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message)
    console.error("Tip: Check if your current IP is whitelisted in MongoDB Atlas Network Access (0.0.0.0/0) or check your connection string.")
  }
}

// Event listeners for connection monitoring
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected!")
})

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error occurred:", err.message)
})

module.exports = connectDatabase
