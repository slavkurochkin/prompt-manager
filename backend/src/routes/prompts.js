const express = require('express');
const db = require('../db');
const validate = require('../validations/validate');
const {
  createPromptSchema,
  updatePromptSchema,
  updateRatingSchema,
  updateNoteSchema,
  updateTagsSchema,
  idParamSchema,
  refinePromptSchema
} = require('../validations/promptValidation');
const { refinePrompt } = require('../services/promptRefinement');

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
router.get('/:id', validate(idParamSchema, 'params'), async (req, res) => {
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
router.post('/', validate(createPromptSchema), async (req, res) => {
  try {
    const { title, content, model, token_count, rating, note, tags } = req.body;
    
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
router.put('/:id', validate(idParamSchema, 'params'), validate(updatePromptSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, model, token_count, rating, note, tags } = req.body;
    
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
router.patch('/:id/rating', validate(idParamSchema, 'params'), validate(updateRatingSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    
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
router.patch('/:id/note', validate(idParamSchema, 'params'), validate(updateNoteSchema), async (req, res) => {
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
router.patch('/:id/tags', validate(idParamSchema, 'params'), validate(updateTagsSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { tags } = req.body;
    
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
router.delete('/:id', validate(idParamSchema, 'params'), async (req, res) => {
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

// Refine a prompt using AI
router.post('/refine', validate(refinePromptSchema), async (req, res) => {
  try {
    const { prompt } = req.body;
    
    const refinedPrompt = await refinePrompt(prompt);
    
    res.json({ 
      original: prompt,
      refined: refinedPrompt 
    });
  } catch (error) {
    console.error('Error refining prompt:', error);
    
    if (error.message.includes('OPENAI_API_KEY')) {
      return res.status(500).json({ 
        error: 'OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file.' 
      });
    }
    
    res.status(500).json({ 
      error: error.message || 'Failed to refine prompt' 
    });
  }
});

module.exports = router;

