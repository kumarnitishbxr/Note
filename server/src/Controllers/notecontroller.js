

import Note from "../models/Notes.js";

/* ================= CREATE NOTE ================= */
export const createNote = async (req, res) => {
  try {
    const { title, content, category, color } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title & content required" });
    }

    const note = await Note.create({
      title,
      content,
      category,
      color,
      user: req.user._id, // ✅ MUST
    });

    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Create failed" });
  }
};

/* ================= GET USER NOTES ================= */
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fetch failed" });
  }
};

/* ================= UPDATE NOTE ================= */
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOneAndUpdate(
      { _id: id, user: req.user._id }, // 🔒 owner check
      req.body,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};

/* ================= DELETE NOTE ================= */
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    res.json({ message: "Note deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
};
