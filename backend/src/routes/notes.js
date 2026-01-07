const express = require('express');
const db = require('../db');

const router = express.Router();

// Get all notes (pinned first, then by updated_at)
router.get('/', async (req, res) => {
  try {
    const { folder } = req.query;
    
    let query = 'SELECT * FROM notes';
    const params = [];
    
    if (folder) {
      query += ' WHERE folder = $1';
      params.push(folder);
    }
    
    query += ' ORDER BY is_pinned DESC, updated_at DESC';
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Get all unique folders
router.get('/folders', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT DISTINCT folder FROM notes WHERE folder IS NOT NULL AND folder != \'\' ORDER BY folder'
    );
    res.json(result.rows.map(r => r.folder));
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

// Get a single note by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM notes WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  try {
    const { title, content, color, is_pinned, folder } = req.body;
    
    const result = await db.query(
      'INSERT INTO notes (title, content, color, is_pinned, folder) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title || 'Untitled', content || '', color || 'default', is_pinned || false, folder || null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update a note
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, color, is_pinned, folder } = req.body;
    
    const result = await db.query(
      'UPDATE notes SET title = $1, content = $2, color = $3, is_pinned = $4, folder = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [title || 'Untitled', content || '', color || 'default', is_pinned || false, folder || null, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Toggle pin status
router.patch('/:id/pin', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'UPDATE notes SET is_pinned = NOT is_pinned, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error toggling pin:', error);
    res.status(500).json({ error: 'Failed to toggle pin' });
  }
});

// Update note color
router.patch('/:id/color', async (req, res) => {
  try {
    const { id } = req.params;
    const { color } = req.body;
    
    const result = await db.query(
      'UPDATE notes SET color = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [color || 'default', id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating color:', error);
    res.status(500).json({ error: 'Failed to update color' });
  }
});

// Move note to folder
router.patch('/:id/folder', async (req, res) => {
  try {
    const { id } = req.params;
    const { folder } = req.body;
    
    const result = await db.query(
      'UPDATE notes SET folder = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [folder || null, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error moving note:', error);
    res.status(500).json({ error: 'Failed to move note' });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM notes WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json({ message: 'Note deleted successfully', note: result.rows[0] });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

module.exports = router;

