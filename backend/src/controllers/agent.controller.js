const { StatusCodes } = require("http-status-codes")
const { AgentService } = require("../services")
const agentService = new AgentService()

const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body
    const context = await agentService.generateContext(prompt)
    res.status(StatusCodes.OK).json(context.content)
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

module.exports = { generateContent }
