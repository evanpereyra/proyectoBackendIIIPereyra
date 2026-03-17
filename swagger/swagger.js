import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Adoptme API',
      description: 'Documentación de la API',
      version: '1.0.0'
    }
  },
  apis: ['src/routes/*.router.js']
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

export default swaggerSpecs;