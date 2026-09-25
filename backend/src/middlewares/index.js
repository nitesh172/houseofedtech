const validateSchema = require("./schema.validator")
const auth = require("./auth.middleware")

module.exports = {
  validateSchema,
  auth,
}
