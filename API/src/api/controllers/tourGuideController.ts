import { createPreviousWorkService, updateProfileService } from "@/services/tourGuideService";
import { Request, Response } from "express";

// TODO the user_id should be taken from the token, and not directly as input from the user

export const createPreviousWork = async (req: Request, res: Response): Promise<any> => {
  const { title, place, from, to, tour_guide_id } = req.body;

  const newWorkExperience = await createPreviousWorkService(title, place, from, to);
  res.json({ newWorkExperience });
};
export const updateProfile = async (req: Request, res: Response): Promise<any> => {
  const { years_of_experience, previous_work_description, photo, user_id, tour_guide_id } = req.body;
  const updatedProfile = updateProfileService(years_of_experience, previous_work_description, photo, user_id, tour_guide_id);
  res.json({ updatedProfile });
};
