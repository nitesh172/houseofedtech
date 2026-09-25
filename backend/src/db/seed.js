const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { User } = require("../models")
const config = require("../config")

async function seed() {
    config.databaseUrl = "mongodb+srv://niteshbaghel172_db_user:4l9ZJd1r4s5QnqxK@cluster0.5jfmb0f.mongodb.net/houseofedtech"
  if (!config.databaseUrl) {
    console.error("Error: DATABASE_URL environment variable is not set in backend/.env")
    process.exit(1)
  }

  try {
    console.log("Connecting to database...")
    await mongoose.connect(config.databaseUrl)
    console.log("Connected to database.")

    // 1. Create or find test user
    const email = "test@example.com"
    const password = "password123"
    let user = await User.findOne({ email })

    if (!user) {
      console.log(`Creating test user (${email})...`)
      const hashedPassword = await bcrypt.hash(password, 10)
      user = await User.create({
        name: "Test User",
        email,
        password: hashedPassword,
      })
      console.log("Test user created successfully.")
    } else {
      console.log(`Test user (${email}) already exists.`)
    }
    console.log("-----------------------------------------------")
    console.log(`Test User Email:    ${email}`)
    console.log(`Test User Password: ${password}`)
    console.log("-----------------------------------------------\n")

  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log("Disconnected from database.")
  }
}

seed()
