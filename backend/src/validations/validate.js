const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    let data;
    
    // Get data from the specified source
    switch (source) {
      case 'body':
        data = req.body;
        break;
      case 'params':
        data = req.params;
        break;
      case 'query':
        data = req.query;
        break;
      default:
        data = req.body;
    }

    // Validate the data
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true  // Remove unknown fields
    });

    if (error) {
      // Format validation errors
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    // Replace the original data with validated and sanitized data
    switch (source) {
      case 'body':
        req.body = value;
        break;
      case 'params':
        req.params = value;
        break;
      case 'query':
        req.query = value;
        break;
    }

    next();
  };
};

module.exports = validate;

