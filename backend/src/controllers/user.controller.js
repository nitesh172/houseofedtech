const { StatusCodes } = require("http-status-codes")
const { UserService } = require("../services")
const userService = new UserService()

const getUser = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await userService.getUser(userId)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers()
    res.status(StatusCodes.OK).json(users)
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

module.exports = { getUser, getUsers }
