import mongoose from "mongoose";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import path from "path";
import LoggerInstance from "./logger";
import Grid from "gridfs-stream";

export function gridfsLoader({
  mongoConnection,
}: {
  mongoConnection: mongoose.Connection;
}) {
  try {
    let gfs: Grid.Grid | undefined;

    mongoConnection.once("open", () => {
      gfs = Grid(mongoConnection.db, mongoose.mongo);
      gfs.collection("uploads");
      LoggerInstance.info("GridFS initialized successfully");
    });

    // Create a storage engine using multer-gridfs-storage
    const storage = new GridFsStorage({
      url: mongoConnection.host, // Use the connection string from the client
      options: { useNewUrlParser: true, useUnifiedTopology: true },
      file: (req, file) => {
        return new Promise((resolve, reject) => {
          const filename = `${Date.now()}-${file.originalname}`;
          const fileInfo = {
            filename: filename,
            bucketName: "uploads", // Collection name for the files
          };
          resolve(fileInfo);
        });
      },
    });

    const upload = multer({ storage });

    return { gfs, upload };
  } catch (e) {
    LoggerInstance.error("🔥 Error on gridfs upload file: %o", e);
    throw e;
  }
}
