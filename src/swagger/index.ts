import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Instituições",
      version: "1.0.0",
    },
  },
  apis: [
    "./src/swagger/*.ts"
  ],
});

export function setupSwagger(app: any) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
