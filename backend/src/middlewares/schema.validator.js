const { StatusCodes } = require("http-status-codes")

const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body)
    next()
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
  }
}

module.exports = validateSchema
