const yup = require("yup")

const createNoteSchema = yup.object({
  title: yup.string().required("Title is required").trim(),
  summary: yup.string().nullable().optional().default(""),
  content: yup.string().required("Content is required"),
  tags: yup.array().of(yup.string()).optional(),
})

const updateNoteSchema = yup.object({
  title: yup.string().optional().trim(),
  summary: yup.string().nullable().optional().default(""),
  content: yup.string().optional(),
  tags: yup.array().of(yup.string()).optional(),
    isPinned: yup.boolean().optional(),
    isArchived: yup.boolean().optional(),
})

const signupSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
})

const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
})

module.exports = {
  createNoteSchema,
  updateNoteSchema,
  signupSchema,
  loginSchema,
}
