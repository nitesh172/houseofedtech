const { User } = require("../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require("../config")
const SALT_ROUND = 10

class AuthService {
  async login(credentials) {
    const user = await User.findOne({ email: credentials.email })

    if (!user) {
      return "USER_NOT_FOUND"
    }

    const validPassword = await bcrypt.compare(
      credentials.password,
      user.password,
    )

    if (!validPassword) {
      return "INVALID_CREDENTIALS"
    }

    const token = jwt.sign({ _id: user._id }, config.jwtSecret, {
      expiresIn: "1h",
    })

    user.password = undefined

    return { token, user }
  }

  async signUp(credentials) {
    const user = await User.findOne({ email: credentials.email })

    if (user) {
      return "USER_ALREADY_EXISTS"
    }

    const hashedPassword = await bcrypt.hash(credentials.password, SALT_ROUND)

    const newUser = await User.create({
      name: credentials.name,
      email: credentials.email,
      password: hashedPassword,
    })

    newUser.password = undefined
    return newUser
  }
}

module.exports = AuthService
