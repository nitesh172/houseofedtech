const config = require("../config/index.js")
const groq = require("../agent/index.js")

module.exports = class AgentService {
  async generateContext(prompt) {
    const response = await groq.chat.completions.create({
      model: config.aiModel,
      messages: [
        { role: "system", content: config.aiContext },
        { role: "user", content: prompt }
      ]
    })
    return response.choices[0].message
  }
}
