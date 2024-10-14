import mongoose from "mongoose";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import LoggerInstance from "./logger";
import Grid from "gridfs-stream";
import { GridFSBucket } from "mongodb";

export async function gridfsLoader({
  mongoConnection,
}: {
  mongoConnection: mongoose.Connection;
}) {
  try {
    let gfs: GridFSBucket | undefined;
    let upload: multer.Multer;

    if (mongoConnection.readyState !== 1) {
      await new Promise<void>((resolve, reject) => {
        mongoConnection.once("open", () => {
          if (mongoConnection.db) {
            gfs = new GridFSBucket(mongoConnection.db, { bucketName: "uploads" });
            LoggerInstance.info("✌️ GridFS initialized successfully");
          } else {
            throw new Error("MongoDB connection database is undefined");
          }
          resolve();
        });

        mongoConnection.on("error", (err) => {
          console.error("🔥 MongoDB connection error:", err); // More explicit error logging
          reject(err);
        });
      });
    } else {
      if (mongoConnection.db) {
        gfs = new GridFSBucket(mongoConnection.db, { bucketName: "uploads" });
        LoggerInstance.info("✌️ GridFS initialized successfully");
      } else {
        throw new Error("MongoDB connection database is undefined");
      }
    }

    const storage = new GridFsStorage({
      db: mongoConnection.db as any, // Ensure the correct type casting
      file: (req, file) => {
        return new Promise((resolve, reject) => {
          const filename = `${Date.now()}-${file.originalname}`;
          const fileInfo = {
            filename: filename,
            bucketName: "uploads", // Collection name for the files
            _id: new mongoose.Types.ObjectId(),
          };
          resolve(fileInfo);
        });
      },
    });

    storage.on("connection", (db) => {
      console.log("GridFsStorage connected to database");
    });

    storage.on("connectionFailed", (err) => {
      console.error("GridFsStorage connection failed:", err);
    });

    upload = multer({ storage });

    return { gfs, upload };
  } catch (e) {
    LoggerInstance.error("🔥 Error on gridfs upload file: %o", e);
    console.error("Error on gridfs upload file:", e);
    throw e;
  }
}
