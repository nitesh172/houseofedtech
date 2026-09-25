const router = require("express").Router()
const { noteController } = require("../controllers")
const { validateSchema } = require("../middlewares")
const { createNoteSchema, updateNoteSchema } = require("../validations")

router.get("/", noteController.getNotes)
router.get("/:id", noteController.getNote)
router.post("/", validateSchema(createNoteSchema), noteController.createNote)
router.patch(
  "/:id",
  validateSchema(updateNoteSchema),
  noteController.updateNote,
)
router.delete("/:id", noteController.deleteNote)

module.exports = router
