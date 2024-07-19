const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { protect } = require('../middleware/auth');

// Create a note
router.post('/', protect, async (req, res) => {
  const { title, content, tags, backgroundColor } = req.body;
  try {
    const note = new Note({
      userId: req.user.id,
      title,
      content,
      tags,
      backgroundColor
    });
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all notes
router.get('/', protect, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id, trashed: false });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get archived notes
router.get('/archived', protect, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id, archived: true, trashed: false });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trashed notes
router.get('/trashed', protect, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id, trashed: true });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a note
router.put('/:id', protect, async (req, res) => {
  const { title, content, tags, backgroundColor, archived, trashed } = req.body;
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Note not found' });
    }
    note.title = title || note.title;
    note.content = content || note.content;
    note.tags = tags || note.tags;
    note.backgroundColor = backgroundColor || note.backgroundColor;
    note.archived = archived !== undefined ? archived : note.archived;
    note.trashed = trashed !== undefined ? trashed : note.trashed;
    note.updatedAt = Date.now();
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a note (move to trash)
router.delete('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Note not found' });
    }
    note.trashed = true;
    note.updatedAt = Date.now();
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
