import { ISlot, ISlotUpdateDTO } from "@/interfaces/ISlot";
import SlotService from "@/services/slotService";
import { Schema, Types } from "mongoose";
import Container, { Service } from "typedi";

@Service()
export class SlotController {
  public async createSlot(req: any, res: any) {
    const slotService = Container.get(SlotService);
    const slotData = req.body as ISlot;
    const newSlot = await slotService.createSlot(slotData);
    res.status(newSlot.status).json(newSlot);

    // Create a slot
  }

  public async updateSlot(req: any, res: any) {
    const slotService = Container.get(SlotService);
    const slotData = req.body as ISlotUpdateDTO;
    const updatedSlot = await slotService.updateSlot(slotData);
    res.status(updatedSlot.status).json(updatedSlot);
    // Update a slot
  }

  public async deleteSlot(req: any, res: any) {
    const slotService = Container.get(SlotService);
    const { slot_id } = req.params;
    const slotIdObj = new Types.ObjectId(slot_id);
    const deletedSlot = await slotService.deleteSlot(slotIdObj);
    res.status(deletedSlot.status).json(deletedSlot);
  }

  public async getSlot(req: any, res: any) {
    const slotService = Container.get(SlotService);
    const { slot_id } = req.params;
    const slotIdObj = new Types.ObjectId(slot_id);
    const slot = await slotService.getSlot(slotIdObj);
    res.status(slot.status).json(slot);

    // Get a slot
  }
}
