import { Container, Service } from "typedi";
import { FileService } from "@/services/fileService";

@Service()
export class FileController {
  public async uploadFile(req: any, res: any) {
    const fileService: FileService = Container.get(FileService);
    const file = await fileService.uploadFile(req, res);
  }

  //   public async downloadFile(req: any, res: any) {
  //     const fileService: FileService = Container.get(FileService);
  //     const file = await fileService.downloadFileService(req, res);
  //     res.status(file.status).json(file);
  //   }

  //   public async deleteFile(req: any, res: any) {
  //     const { id } = req.params;
  //     const fileService: FileService = Container.get(FileService);
  //     const file = await fileService.deleteFileService(id);
  //     res.status(file.status).json(file);
  //   }
}
