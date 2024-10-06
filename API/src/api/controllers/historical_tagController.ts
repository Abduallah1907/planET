import Historical_tagService from "@/services/historical_tagService";
import Container, { Service } from "typedi";
@Service()
export class Historical_tagController {
  public async getAllHistorical_tagController(req: any, res: any) {
    const historical_tagService: Historical_tagService = Container.get(
      Historical_tagService
    );
    const historical_tag =
      await historical_tagService.getAllHistorical_tagService();
    res.status(historical_tag.status).json({ historical_tag });
  }
  // Create a historical tag
  public async createHistorical_tagController(req: any, res: any) {
    const historical_tagService: Historical_tagService = Container.get(
      Historical_tagService
    );
    const historical_tag =
      await historical_tagService.createHistorical_tagService(req.body);
    res.status(historical_tag.status).json({ historical_tag });
  }
  // Get a historical tag by ID
  public async getHistorical_tagByIDController(req: any, res: any) {
    const historical_tagService: Historical_tagService = Container.get(
      Historical_tagService
    );
    const historical_tag =
      await historical_tagService.getHistorical_tagByIDService(req.params.id);
    res.status(historical_tag.status).json({ historical_tag });
  }
  // Update a historical tag
  public async updateHistorical_tagController(req: any, res: any) {
    const historical_tagService: Historical_tagService = Container.get(
      Historical_tagService
    );
    const historical_tag =
      await historical_tagService.updateHistorical_tagService(
        req.params.id,
        req.body
      );
    res.status(historical_tag.status).json({ historical_tag });
  }
  // Delete a historical tag
  public async deleteHistorical_tagController(req: any, res: any) {
    const historical_tagService: Historical_tagService = Container.get(
      Historical_tagService
    );
    const historical_tag =
      await historical_tagService.deleteHistorical_tagService(req.params.id);
    res.status(historical_tag.status).json({ historical_tag });
  }
}
