const { User } = require("../models")

module.exports = class UserService {
  async getUser(userId) {
    const user = await User.findById(userId)
    return user
  }

  async getUsers() {
    return await User.find()
  }
}
