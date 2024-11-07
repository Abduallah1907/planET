import { GridFSBucket, ObjectId } from "mongodb";
import { Inject, Service } from "typedi";
import multer from "multer";
import mongoose from "mongoose";
import response from "@/types/responses/response";
import { Container } from "typedi";
import { create } from "domain";
import { createWriteStream } from "fs";

@Service()
export class FileService {
  // Method to upload a single file
  public async uploadFile(req: any, res: any) {
    if (!req.files) {
      res.status(400).json({ message: "File upload failed" });
      return;
    }

    const fileId = new ObjectId();
    const file = req.files.file;
    const filename = `${Date.now()}-${file.name}`;

    const gfs = Container.get<GridFSBucket>("gridfsInstance");
    const uploadStream = gfs.openUploadStream(filename, {
      contentType: file.mimetype,
      metadata: { _id: fileId.toString() },
    });

    uploadStream.end(file.data);

    uploadStream.on("finish", async () => {
      try {
        const files = await gfs.find({ filename }).toArray();
        if (!files || files.length === 0) {
          return res
            .status(404)
            .json({ message: "File not found after upload" });
        }

        res.status(201).json(
          new response(true, files[0], "File uploaded successfuly", 201) // Return the file metadata after upload
        );
      } catch (error) {
        res.status(500).json({
          message: "Error retrieving uploaded file",
          error: (error as Error).message,
        });
      }
    });

    uploadStream.on("error", (error: Error) => {
      res
        .status(500)
        .json({ message: "File upload error", error: error.message });
    });
  }

  // Method to upload multiple files
  uploadMultipleFiles(req: any, res: any) {
    if (!req.files || !(req.files as any[]).length) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const files = req.files as Express.Multer.File[]; // Ensure correct typing for req.files
    const uploadedFiles: any[] = []; // Array to store metadata of uploaded files

    const gfs = Container.get<GridFSBucket>("gridfsInstance");

    // Use Promise.all to ensure all files are uploaded before sending the response
    Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const fileId = new ObjectId();
          const filename = `${Date.now()}-${file.originalname}`;

          const uploadStream = gfs.openUploadStream(filename, {
            contentType: file.mimetype,
            metadata: { _id: fileId.toString() },
          });

          uploadStream.end(file.buffer);

          uploadStream.on("finish", async () => {
            try {
              const uploadedFile = await gfs.find({ filename }).toArray();
              if (!uploadedFile || uploadedFile.length === 0) {
                return reject(new Error("File not found after upload"));
              }
              uploadedFiles.push(uploadedFile[0]); // Store file metadata
              resolve(uploadedFile[0]);
            } catch (error) {
              reject(error);
            }
          });

          uploadStream.on("error", (error: Error) => {
            reject(error);
          });
        });
      })
    )
      .then(() => {
        res
          .status(200)
          .json(
            new response(
              true,
              uploadedFiles,
              "Files uploaded successfully",
              200
            )
          );
      })
      .catch((error) => {
        res
          .status(500)
          .json({ message: "File upload error", error: error.message });
      });
  }

  async downloadFileById(req: any, res: any) {
    const { id } = req.params;

    // Validate the ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    try {
      const gfs = Container.get<GridFSBucket>("gridfsInstance");

      const files = await gfs.find({ _id: new ObjectId(id) }).toArray();
      if (!files || files.length === 0) {
        return res.status(404).json({ message: "File not found" });
      }
      const file = files[0];

      // Create a download stream for the file
      const downloadStream = gfs.openDownloadStream(new ObjectId(id));

      // Handle errors during streaming
      downloadStream.on("error", (error) => {
        return res
          .status(404)
          .json({ message: "File not found", error: error.message });
      });

      // Set the response headers
      res.setHeader("Content-Type", file.contentType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.filename}"`
      );

      // Pipe the download stream to the response
      downloadStream.pipe(res);

      // Handle the end of the stream
      downloadStream.on("end", () => {
        res.end();
      });
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "Internal Server Error",
          error: (error as Error).message,
        });
    }
  }
}
