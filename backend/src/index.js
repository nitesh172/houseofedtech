const app = require("./app")
const config = require("./config")
const connectDatabase = require("./db")

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`)
  connectDatabase()
})
