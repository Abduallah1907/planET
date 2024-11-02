import { Router } from "express";
import Container from "typedi";
import { SlotController } from "../controllers/slotController";
const route = Router();

export default (app: Router) => {
  const slotController: SlotController = Container.get(SlotController);
  app.use("/slot", route);
  route.post("/createSlot", slotController.createSlot);
  route.put("/updateSlot", slotController.updateSlot);
  route.delete("/deleteSlot/:slot_id", slotController.deleteSlot);
  route.get("/getSlot/:slot_id", slotController.getSlot);
};
