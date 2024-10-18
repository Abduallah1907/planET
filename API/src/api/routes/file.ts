import { Router } from "express";
import Container from "typedi";
import { FileService } from "@/services/fileService";
const router = Router();

export default (app: Router) => {
  const fileService: FileService = Container.get(FileService);
  const upload = Container.get<any>("uploadInstance");
  app.use("/file", router);

  router.post("/upload", upload.single("file"), fileService.uploadFile);

  router.post(
    "/uploadMultiple",
    upload.array("files", 10),
    fileService.uploadMultipleFiles
  );

  router.get("/download/:id", fileService.downloadFileById);
};
