const { Note } = require("../models")

module.exports = class NoteService {
  async getNote(noteId) {
    const note = await Note.findById(noteId).populate(
      "createdBy",
      "name email",
    )
    return note
  }

  async getNotes(filter) {
    return await Note.find(filter).populate("createdBy", "name email")
  }

  async createNote(notePayload) {
    const note = new Note(notePayload)
    await note.save()
    return note
  }

  async updateNote(noteId, updatePayload) {
    const note = await Note.findByIdAndUpdate(noteId, updatePayload, {
      new: true,
    }).populate("createdBy", "name email")
    return note
  }

  async deleteNote(noteId) {
    await Note.findByIdAndDelete(noteId)
  }
}
