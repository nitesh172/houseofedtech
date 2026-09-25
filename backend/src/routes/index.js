const router = require("express").Router()
const { StatusCodes } = require("http-status-codes")
const authRoutes = require("./auth.routes")
const userRoutes = require("./user.routes")
const noteRoutes = require("./note.routes")
const agentRoutes = require("./agent.routes")
const { auth } = require("../middlewares")

router.get("/health", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Health is good" })
})

router.use("/auth", authRoutes)
router.use("/agent", auth, agentRoutes)
router.use("/user", auth, userRoutes)
router.use("/notes", auth, noteRoutes)

module.exports = router
