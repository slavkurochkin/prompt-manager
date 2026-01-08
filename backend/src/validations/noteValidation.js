const Joi = require('joi');

// Validation schema for creating a note
const createNoteSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(255)
    .optional()
    .default('Untitled')
    .messages({
      'string.max': 'Title must not exceed 255 characters'
    }),
  
  content: Joi.string()
    .trim()
    .allow('')
    .optional()
    .default('')
    .messages({
      'string.base': 'Content must be a string'
    }),
  
  color: Joi.string()
    .trim()
    .max(20)
    .optional()
    .default('default')
    .messages({
      'string.max': 'Color must not exceed 20 characters'
    }),
  
  is_pinned: Joi.boolean()
    .optional()
    .default(false)
    .messages({
      'boolean.base': 'is_pinned must be a boolean'
    }),
  
  folder: Joi.string()
    .trim()
    .max(100)
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Folder name must not exceed 100 characters'
    })
});

// Validation schema for updating a note
const updateNoteSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(255)
    .optional()
    .messages({
      'string.max': 'Title must not exceed 255 characters'
    }),
  
  content: Joi.string()
    .trim()
    .allow('')
    .optional()
    .messages({
      'string.base': 'Content must be a string'
    }),
  
  color: Joi.string()
    .trim()
    .max(20)
    .optional()
    .messages({
      'string.max': 'Color must not exceed 20 characters'
    }),
  
  is_pinned: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'is_pinned must be a boolean'
    }),
  
  folder: Joi.string()
    .trim()
    .max(100)
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Folder name must not exceed 100 characters'
    })
});

// Validation schema for updating color only
const updateColorSchema = Joi.object({
  color: Joi.string()
    .trim()
    .max(20)
    .optional()
    .default('default')
    .messages({
      'string.max': 'Color must not exceed 20 characters'
    })
});

// Validation schema for updating folder only
const updateFolderSchema = Joi.object({
  folder: Joi.string()
    .trim()
    .max(100)
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Folder name must not exceed 100 characters'
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

// Validation schema for folder query parameter
const folderQuerySchema = Joi.object({
  folder: Joi.string()
    .trim()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Folder name must not exceed 100 characters'
    })
});

module.exports = {
  createNoteSchema,
  updateNoteSchema,
  updateColorSchema,
  updateFolderSchema,
  idParamSchema,
  folderQuerySchema
};


