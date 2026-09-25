const { userController } = require("../controllers")

const router = require("express").Router()

router.get("/list", userController.getUsers)

module.exports = router
