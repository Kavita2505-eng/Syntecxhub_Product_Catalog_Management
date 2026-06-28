const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Syntecxhub Product Catalog Management API',
      version: '1.0.0',
      description: 'API documentation for the Web Development Internship Product Catalog Management system. Features user authorization, complete CRUD capabilities, advanced search/filters, and MongoDB aggregate reports.',
      contact: {
        name: 'Syntecxhub Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
    },
  },
  // Search for JSDoc documentation inside the routes folder
  apis: ['./backend/routes/*.js', './routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
