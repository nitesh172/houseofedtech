require("dotenv").config()

module.exports = {
  port: process.env.PORT || 8080,
  databaseUrl: process.env.DATABASE_URL,
  corsOrigin: process.env.CORS_ORIGIN,
  jwtSecret: process.env.JWT_SECRET,
  groqApiKey: process.env.GROQ_API_KEY,
  aiModel: process.env.AI_MODEL || "openai/gpt-oss-20b",
  aiContext: process.env.AI_CONTEXT || "You are a helpful assistant that that make notes summary from the given content. You should return the notes summary only in JSON format with the following structure: { \"summary\": \"<summary of the content>\", \"keyPoints\": [\"<key point 1>\", \"<key point 2>\", ...] }",
}
