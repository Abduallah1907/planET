import {
  createPreviousWorkService,
  deletePreviousWorkService,
  getProfileService,
  updatePreviousWorkService,
  updateProfileService,
} from "@/services/tourGuideService";
import { Request, Response } from "express";

// TODO the user_id should be taken from the token, and not directly as input from the user

export const createPreviousWork = async (req: Request, res: Response): Promise<any> => {
  const { title, place, from, to, tour_guide_id } = req.body;

  const newWorkExperience = await createPreviousWorkService(title, place, from, to);
  res.json({ newWorkExperience });
};

export const updatePreviousWork = async (req: Request, res: Response): Promise<any> => {
  const { _id, title, place, from, to } = req.body;
  const updatedPreviousWork = await updatePreviousWorkService(_id, title, place, from, to);
  res.json({ updatedPreviousWork });
};

export const deletePreviousWork = async (req: Request, res: Response): Promise<any> => {
  const { _id } = req.body;
  const deletedPreviousWork = await deletePreviousWorkService(_id);
  res.json(deletedPreviousWork);
};
// ---- Profile ----
export const getProfile = async (req: Request, res: Response): Promise<any> => {
  const { _id } = req.body;
  const tourGuideProfile = await getProfileService(_id);
  res.json({ tourGuideProfile });
};
export const updateProfile = async (req: Request, res: Response): Promise<any> => {
  const { years_of_experience, previous_work_description, photo, user_id, tour_guide_id } = req.body;
  const updatedProfile = updateProfileService(years_of_experience, previous_work_description, photo, user_id, tour_guide_id);
  res.json({ updatedProfile });
};
