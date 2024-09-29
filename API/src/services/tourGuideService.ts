import Tour_Guide from "@/models/Tour_guide";
import { ObjectId } from "mongoose";
import response from "@/types/responses/response";
import User from "@/models/user";
import UserRoles from "@/types/enums/userRoles";

// CRUD for tour guide profile
// TODO update the user first_login boolean
export const createProfileService = async (
  years_of_experience: Number,
  previous_work_description: String,
  documents_required: String,
  photo: String,
  user_id: ObjectId
): Promise<any> => {
  const profileAlreadyExists = await Tour_Guide.find({ user_id });
  if (profileAlreadyExists)
    throw new Error(
      "The tour guide has already made a profile; use the update API instead"
    );
  const user = await User.findById(user_id).select("status role");
  if (user) {
    const isAccepted = user.status;
    const role = user.role;
    if (!isAccepted)
      throw new Error("The tour guide has not been accepted by an admin yet");
    if (role !== UserRoles.TourGuide)
      throw new Error("This user is not a tour guide");
  } else {
    throw new Error("This user is not registered to our system??");
  }

  const newProfile = await Tour_Guide.create({
    user_id: user_id,
    years_of_experience,
    previous_work_description,
    documents_required,
    photo,
  });
  return new response(true, newProfile, "Tour guide profile created!", 200);
};
