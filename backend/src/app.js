const express = require("express")
const cors = require("cors")
const config = require("./config")

const app = express()
const routes = require("./routes")

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  }),
)
app.use(express.json())

app.use("/", routes)

app.get("/", (req, res) => {
  res.json({ message: "Welcome to House of EdTech-Backend" })
})

module.exports = app
