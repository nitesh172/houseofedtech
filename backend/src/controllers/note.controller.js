const { StatusCodes } = require("http-status-codes")
const { NoteService } = require("../services")
const noteService = new NoteService()

const getNote = async (req, res) => {
  try {
    const noteId = req.params.id
    const note = await noteService.getNote(noteId)
    if (!note) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Note not found" })
    }

    const creatorId = note.createdBy && (note.createdBy._id || note.createdBy)
    if (creatorId.toString() !== req.user.id.toString()) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "You are not authorized to view this note" })
    }

    res.status(StatusCodes.OK).json(note)
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

const getNotes = async (req, res) => {
  try {
    const filter = { createdBy: req.user.id }
    if (req.query.tags) {
      filter.tags = { $in: req.query.tags.split(",") }
    }

    if(req.query.isPinned) {
        filter.isPinned = req.query.isPinned === 'true';
    }

    if(req.query.isArchived) {
        filter.isArchived = req.query.isArchived === 'true';
    }

    const notes = await noteService.getNotes(filter)
    res.status(StatusCodes.OK).json(notes)
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

const createNote = async (req, res) => {
  try {
    const note = await noteService.createNote({
      ...req.body,
      createdBy: req.user.id,
    })
    res.status(StatusCodes.CREATED).json(note)
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

const updateNote = async (req, res) => {
  try {
    const noteId = req.params.id
    const note = await noteService.getNote(noteId)
    if (!note) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Note not found" })
    }

    const creatorId = note.createdBy && (note.createdBy._id || note.createdBy)
    if (creatorId.toString() !== req.user.id.toString()) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "You are not authorized to update this note" })
    }

    const updatedNote = await noteService.updateNote(noteId, req.body)
    res.status(StatusCodes.OK).json(updatedNote)
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id
    const note = await noteService.getNote(noteId)
    if (!note) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Note not found" })
    }

    const creatorId = note.createdBy && (note.createdBy._id || note.createdBy)
    if (creatorId.toString() !== req.user.id.toString()) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "You are not authorized to delete this note" })
    }

    await noteService.deleteNote(noteId)
    res.status(StatusCodes.OK).json({ message: "Note deleted successfully" })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

module.exports = { getNote, getNotes, createNote, updateNote, deleteNote }
