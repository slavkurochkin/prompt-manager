const express = require('express');
const db = require('../db');

const router = express.Router();

// Get all prompts
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM prompts ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
});

// Get a single prompt by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM prompts WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching prompt:', error);
    res.status(500).json({ error: 'Failed to fetch prompt' });
  }
});

// Create a new prompt
router.post('/', async (req, res) => {
  try {
    const { title, content, model, token_count, rating, note, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const result = await db.query(
      'INSERT INTO prompts (title, content, model, token_count, rating, note, tags) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, content, model || null, token_count || 0, rating || 0, note || null, tags || []]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating prompt:', error);
    res.status(500).json({ error: 'Failed to create prompt' });
  }
});

// Update a prompt
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, model, token_count, rating, note, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const result = await db.query(
      'UPDATE prompts SET title = $1, content = $2, model = $3, token_count = $4, rating = $5, note = $6, tags = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
      [title, content, model || null, token_count || 0, rating || 0, note || null, tags || [], id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating prompt:', error);
    res.status(500).json({ error: 'Failed to update prompt' });
  }
});

// Update prompt rating only
router.patch('/:id/rating', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    
    if (rating === undefined || rating < 0 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 0 and 5' });
    }
    
    const result = await db.query(
      'UPDATE prompts SET rating = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [rating, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ error: 'Failed to update rating' });
  }
});

// Update prompt note only
router.patch('/:id/note', async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    
    const result = await db.query(
      'UPDATE prompts SET note = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [note || null, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Update prompt tags only
router.patch('/:id/tags', async (req, res) => {
  try {
    const { id } = req.params;
    const { tags } = req.body;
    
    if (!Array.isArray(tags)) {
      return res.status(400).json({ error: 'Tags must be an array' });
    }
    
    const result = await db.query(
      'UPDATE prompts SET tags = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [tags, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating tags:', error);
    res.status(500).json({ error: 'Failed to update tags' });
  }
});

// Delete a prompt
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM prompts WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    
    res.json({ message: 'Prompt deleted successfully', prompt: result.rows[0] });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    res.status(500).json({ error: 'Failed to delete prompt' });
  }
});

module.exports = router;

