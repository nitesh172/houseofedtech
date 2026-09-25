const OpenAI = require("openai");
const config = require("../config");

const groq = new OpenAI({
    apiKey: config.groqApiKey,
    baseURL: "https://api.groq.com/openai/v1",
});

module.exports = groq;
