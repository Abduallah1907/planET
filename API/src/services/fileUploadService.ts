import { GridFSBucket } from "mongodb";
import { Inject, Service } from "typedi";
import mongoose from "mongoose";
import { createReadStream, ReadStream } from "fs";
import path from "path";
@Service()
export class FileUploadService {
  constructor(
    @Inject("gridfsInstance") private gfs: GridFSBucket // GridFSBucket instance injected
  ) {}

  // Method to upload a file without req/res
  uploadFile(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      // Check if file exists
      if (!file) {
        return reject({ message: "No file provided" });
      }

      // Create a readable stream from the file buffer
      const fileReadStream = createReadStream(file.path);

      // Set up a GridFS writable stream
      const writeStream = this.gfs.openUploadStream(file.originalname, {
        contentType: file.mimetype,
        metadata: { filename: file.originalname },
      });

      // Pipe the file's read stream into the GridFS write stream
      fileReadStream.pipe(writeStream);

      // Handle events on the stream
      writeStream.on("error", (err) => {
        reject({ message: "File upload failed", error: err });
      });

      writeStream.on("finish", () => {
        resolve({ fileId: writeStream.id, filename: file.originalname });
      });
    });
  }

  //   // Method to fetch all files
  //   fetchFiles(): Promise<any[]> {
  //     return new Promise((resolve, reject) => {
  //       this.gfs.find().toArray((err, files) => {
  //         if (err || !files || files.length === 0) {
  //           return reject({ message: "No files found" });
  //         }
  //         resolve(files);
  //       });
  //     });
  //   }

  //   // Method to download a file by filename
  //   downloadFileByName(filename: string): Promise<NodeJS.ReadableStream> {
  //     return new Promise((resolve, reject) => {
  //       this.gfs.findOne({ filename }, (err, file) => {
  //         if (err || !file) {
  //           return reject({ message: "File not found" });
  //         }

  //         // Create read stream and resolve it
  //         const readstream = this.gfs.openDownloadStreamByName(filename);
  //         resolve(readstream);
  //       });
  //     });
  //   }
}
