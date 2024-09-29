import { createProfileService } from "@/services/tourGuideService";
import { Request, Response } from "express";

// TODO the user_id should be taken from the token, and not directly as input from the user
export const createProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  const {
    years_of_experience,
    previous_work_description,
    documents_required,
    photo,
    user_id,
  } = req.body;
  const newProfile = await createProfileService(
    years_of_experience,
    previous_work_description,
    documents_required,
    photo,
    user_id
  );
  res.json({ newProfile });
};
