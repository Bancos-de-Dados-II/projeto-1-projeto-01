import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Instituições",
      version: "1.0.0",
      description: "API para gerenciamento de instituições",
    },
    servers: [
      {
        url: "http://localhost:3333",
        description: "Servidor local",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
