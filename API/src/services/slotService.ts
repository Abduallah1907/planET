import { ISlot, ISlotUpdateDTO } from "@/interfaces/ISlot";
import { InternalServerError, NotFoundError } from "@/types/Errors";
import response from "@/types/responses/response";
import { ObjectId, Types } from "mongoose";
import { Inject, Service } from "typedi";

@Service()
export default class SlotService {
  constructor(@Inject("slotModel") private slotModel: Models.SlotModel) {}

  public async createSlot(slotData: ISlot) {
    const { title, description, from, to } = slotData;
    const newSlot = new this.slotModel({
      title,
      description,
      from,
      to,
    });
    await newSlot.save();

    if (newSlot instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (newSlot == null) {
      throw new NotFoundError("Error in creating slot");
    }
    return new response(true, newSlot, "Slot created", 201);

    // Create a slot
  }
  public async updateSlot(slotData: ISlotUpdateDTO) {
    const { slot_id, title, description, from, to } = slotData;
    const updatedSlot = await this.slotModel.findByIdAndUpdate(
      slot_id,
      { title: title, description: description, from: from, to: to },
      { new: true }
    );

    if (updatedSlot instanceof Error) {
      throw new InternalServerError("Internal server error");
    }

    if (updatedSlot == null) {
      throw new NotFoundError("Slot not found");
    }
    return new response(true, updatedSlot, "Slot updated", 200);

    // Update a slot
  }
  public async deleteSlot(slot_id: Types.ObjectId) {
    const deletedSlot = await this.slotModel.findByIdAndDelete(slot_id);

    if (deletedSlot instanceof Error) {
      throw new InternalServerError("Internal server error");
    }

    if (deletedSlot == null) {
      throw new NotFoundError("Slot not found");
    }

    return new response(true, deletedSlot, "Slot deleted", 200);
    // Delete a slot
  }
  public async getSlot(slot_id: Types.ObjectId) {
    const slot = await this.slotModel.findById(slot_id);

    if (slot instanceof Error) {
      throw new InternalServerError("Internal server error");
    }

    if (slot == null) {
      throw new NotFoundError("Slot not found");
    }

    return new response(true, slot, "Slot found", 200);

    // Get a slot
  }
}
