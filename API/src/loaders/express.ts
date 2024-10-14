import express, { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import { OpticMiddleware } from "@useoptic/express-middleware";
import routes from "@/api";
import config from "@/config";
import "express-async-errors";
import swaggerDocs from "@/swagger";
import multer from "multer"; // Import multer
import { gridfsLoader } from "./gridfs";
import mongooseLoader from "./moongose";
import LoggerInstance from "./logger";
import fileUpload from "express-fileupload";

export default async ({ app }: { app: Application }) => {
  const mongoConnection = await mongooseLoader();

  // const { gfs, upload } = await gridfsLoader({ mongoConnection }); // Load GridFS and multer upload
  LoggerInstance.info("✌️ GridFS initialized successfully");

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.enable("trust proxy");

  // Enable Cross-Origin Resource Sharing to all origins by default
  app.use(cors());

  app.use(fileUpload());
  // HTTP verbs support such as PUT or DELETE
  app.use(require("method-override")());

  // Transforms the raw string of req.body into json
  app.use(express.json());

  // Add debug logging middleware

  /**
   * Health Check endpoints
   * @TODO Explain why they are here
   */
  app.get("/status", (req, res) => {
    res.status(200).end();
  });

  app.head("/status", (req, res) => {
    res.status(200).end();
  });

  // Load API routes
  app.use(config.api.prefix, routes());

  swaggerDocs(app, config.port, routes());

  // API Documentation
  app.use(
    OpticMiddleware({
      enabled: process.env.NODE_ENV !== "production",
    })
  );

  // Catch 404 and forward to error handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    const err = new Error("Not Found");
    (err as any).status = 404;
    next(err);
  });

  // General error-handling middleware (must have 4 arguments)
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // Error-handling middleware for 401 Unauthorized errors
    if (err.name === "UnauthorizedError") {
      res.status(err.status || 401).json({
        code: err.status || 401,
        message: err.message,
        stack: err.stack,
      });
    } else {
      res.status(err.status || 500).json({
        code: err.status || 500,
        errors: {
          message: err.message,
        },
        stack: err.stack,
      });
    }
  });

  // Catch-all route for unmatched paths
};
