const jwt = require("jsonwebtoken")
const { StatusCodes } = require("http-status-codes")
const config = require("../config")
const { User } = require("../models")

const auth = async (req, res, next) => {
  try {
    let token = null

    if (req.headers.cookie) {
      const tokenCookie = req.headers.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
      if (tokenCookie) {
        token = tokenCookie.split("=")[1]
      }
    }

    if (!token) {
      const authHeader = req.headers.authorization
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1]
      }
    }

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Access denied. No token provided.",
      })
    }

    const decoded = jwt.verify(token, config.jwtSecret)

    const user = await User.findById(decoded._id).select("-password")
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Access denied. User not found.",
      })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Access denied. Invalid or expired token.",
    })
  }
}

module.exports = auth
