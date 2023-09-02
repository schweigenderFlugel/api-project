import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "pizza-delivery",
      version: "1.0.0",
    },
  },
  apis: ["src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
