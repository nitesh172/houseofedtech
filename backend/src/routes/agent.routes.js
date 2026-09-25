const router = require("express").Router()
const { agentController } = require("../controllers")

router.post("/generate", agentController.generateContent)

module.exports = router
