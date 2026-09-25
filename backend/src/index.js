const app = require("./app")
const config = require("./config")
const connectDatabase = require("./db")

const startServer = async () => {
  await connectDatabase()

  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
  })
}

startServer()
