const { StatusCodes } = require("http-status-codes")
const { AuthService } = require("../services")

const authService = new AuthService()

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body)

    if (result === "USER_NOT_FOUND") {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" })
    }

    if (result === "INVALID_CREDENTIALS") {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" })
    }

    const { token, user } = result

    const isProduction = process.env.NODE_ENV === "production"
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 3600000, // 1 hour
    })

    res.status(StatusCodes.OK).json({ user })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

const signUp = async (req, res) => {
  try {
    const result = await authService.signUp(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production"
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    })
    res.status(StatusCodes.OK).json({ message: "Logged out successfully" })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

const getMe = async (req, res) => {
  try {
    res.status(StatusCodes.OK).json({ user: req.user })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

module.exports = { login, signUp, logout, getMe }
