const { authController } = require("../controllers")
const { validateSchema, auth } = require("../middlewares")
const { signupSchema, loginSchema } = require("../validations")

const router = require("express").Router()

router.post("/login", validateSchema(loginSchema), authController.login)

router.post("/register", validateSchema(signupSchema), authController.signUp)

router.post("/logout", auth, authController.logout)

router.get("/me", auth, authController.getMe)

module.exports = router
