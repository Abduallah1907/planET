import { GridFSBucket } from "mongodb";
import { Inject, Service } from "typedi";
import mongoose from "mongoose";
import { createReadStream, ReadStream } from "fs";
import { Request, Response } from "express";
import path from "path";
import multer from "multer";

@Service()
export class FileService {
  constructor(
    @Inject("gridfsInstance") private gfs: GridFSBucket,
    @Inject("uploadInstance") private upload: multer.Multer // GridFSBucket instance injected
  ) {}

  // Method to upload a single file
  uploadFile(req: any, res: any) {
    console.log(req.body);
    if (!this.upload || !this.upload.single) {
      res.status(500).json({ message: "Upload instance not initialized" });
    }
    this.upload.single("file")(req, res, (err: any) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "File upload failed", error: err });
      }
      res.json({ file: (req as any).file });
    });
  }

  // Method to upload multiple files
  uploadMultipleFiles(req: Request, res: Response) {
    this.upload.array("files", 10)(req, res, (err: any) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Multiple file upload failed", error: err });
      }
      res.json({ files: (req as any).files });
    });
  }

  // Method to fetch all files
  // fetchFiles(req: Request, res: Response) {
  //   this.gfs.find().toArray((err:any, files:any) => {
  //     if (err || !files || files.length === 0) {
  //       return res.status(404).json({ message: "No files found" });
  //     }
  //     res.json(files);
  //   });
  // }

  // Method to download a file by filename
  // downloadFileByName(req: Request, res: Response) {
  //   const filename = req.params.filename;
  //   this.gfs.findOne({ filename }, (err:any, file:any) => {
  //     if (err || !file) {
  //       return res.status(404).json({ message: "File not found" });
  //     }

  //     // Create read stream and pipe the file to the response
  //     const readstream = this.gfs.openDownloadStreamByName(file.filename);
  //     readstream.pipe(res);
  //   });
  // }
}
