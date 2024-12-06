import { Application, Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import api from "./api";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PlanET API",
      description: "API endpoints for planET Trip Advisor system",
      contact: {
        name: "Abdelrahman Tamer",
        email: "abdelrahmantamer358@gmail.com",
        url: "https://github.com/Advanced-computer-lab-2024/planET/",
      },
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          in: "header",
          name: "Authorization",
          description: "Bearer Token",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:8000/",
        description: "Local server",
      },
      {
        url: "<your live url here>",
        description: "Live server",
      },
    ],
    paths: {}, // Add this line to include the paths property
  },
  // looks for configuration in specified directories
  apis: [`./api/routes/**.ts`, `./api-specifications/**.yml`],
};

function swaggerDocs(app: Application, port: number, router: Router) {
  const swaggerSpec = swaggerJsdoc(options);
  // Swagger Page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Documentation in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

export default swaggerDocs;
