const express = require("express")
const cors = require("cors")
const config = require("./config")

const app = express()
const routes = require("./routes")

const allowedOrigins = [
  config.corsOrigin,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true)
      } else {
        callback(null, true)
      }
    },
    credentials: true,
  }),
)
app.use(express.json())

app.use("/", routes)

app.get("/", (req, res) => {
  res.json({ message: "Welcome to House of EdTech-Backend" })
})

module.exports = app
