const Joi = require('joi');

// Validation schema for creating a prompt
const createPromptSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 1 character',
      'string.max': 'Title must not exceed 255 characters',
      'any.required': 'Title is required'
    }),
  
  content: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Content is required',
      'string.min': 'Content must be at least 1 character',
      'any.required': 'Content is required'
    }),
  
  model: Joi.string()
    .trim()
    .max(100)
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Model name must not exceed 100 characters'
    }),
  
  token_count: Joi.number()
    .integer()
    .min(0)
    .optional()
    .default(0)
    .messages({
      'number.base': 'Token count must be a number',
      'number.integer': 'Token count must be an integer',
      'number.min': 'Token count must be 0 or greater'
    }),
  
  rating: Joi.number()
    .integer()
    .min(0)
    .max(5)
    .optional()
    .default(0)
    .messages({
      'number.base': 'Rating must be a number',
      'number.integer': 'Rating must be an integer',
      'number.min': 'Rating must be between 0 and 5',
      'number.max': 'Rating must be between 0 and 5'
    }),
  
  note: Joi.string()
    .trim()
    .allow(null, '')
    .optional()
    .messages({
      'string.base': 'Note must be a string'
    }),
  
  tags: Joi.array()
    .items(Joi.string().trim().min(1))
    .optional()
    .default([])
    .messages({
      'array.base': 'Tags must be an array',
      'array.includes': 'Each tag must be a non-empty string'
    })
});

// Validation schema for updating a prompt
const updatePromptSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 1 character',
      'string.max': 'Title must not exceed 255 characters',
      'any.required': 'Title is required'
    }),
  
  content: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Content is required',
      'string.min': 'Content must be at least 1 character',
      'any.required': 'Content is required'
    }),
  
  model: Joi.string()
    .trim()
    .max(100)
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Model name must not exceed 100 characters'
    }),
  
  token_count: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Token count must be a number',
      'number.integer': 'Token count must be an integer',
      'number.min': 'Token count must be 0 or greater'
    }),
  
  rating: Joi.number()
    .integer()
    .min(0)
    .max(5)
    .optional()
    .messages({
      'number.base': 'Rating must be a number',
      'number.integer': 'Rating must be an integer',
      'number.min': 'Rating must be between 0 and 5',
      'number.max': 'Rating must be between 0 and 5'
    }),
  
  note: Joi.string()
    .trim()
    .allow(null, '')
    .optional()
    .messages({
      'string.base': 'Note must be a string'
    }),
  
  tags: Joi.array()
    .items(Joi.string().trim().min(1))
    .optional()
    .messages({
      'array.base': 'Tags must be an array',
      'array.includes': 'Each tag must be a non-empty string'
    })
});

// Validation schema for updating rating only
const updateRatingSchema = Joi.object({
  rating: Joi.number()
    .integer()
    .min(0)
    .max(5)
    .required()
    .messages({
      'number.base': 'Rating must be a number',
      'number.integer': 'Rating must be an integer',
      'number.min': 'Rating must be between 0 and 5',
      'number.max': 'Rating must be between 0 and 5',
      'any.required': 'Rating is required'
    })
});

// Validation schema for updating note only
const updateNoteSchema = Joi.object({
  note: Joi.string()
    .trim()
    .allow(null, '')
    .optional()
    .messages({
      'string.base': 'Note must be a string'
    })
});

// Validation schema for updating tags only
const updateTagsSchema = Joi.object({
  tags: Joi.array()
    .items(Joi.string().trim().min(1))
    .required()
    .messages({
      'array.base': 'Tags must be an array',
      'array.includes': 'Each tag must be a non-empty string',
      'any.required': 'Tags is required'
    })
});

// Validation schema for ID parameter
const idParamSchema = Joi.object({
  id: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'ID must be a number',
      'number.integer': 'ID must be an integer',
      'number.min': 'ID must be a positive number',
      'any.required': 'ID is required'
    })
});

module.exports = {
  createPromptSchema,
  updatePromptSchema,
  updateRatingSchema,
  updateNoteSchema,
  updateTagsSchema,
  idParamSchema
};

