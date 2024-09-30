import Tour_Guide from "@/models/Tour_guide";
import { ObjectId, Types } from "mongoose";
import response from "@/types/responses/response";
import User from "@/models/user";
import UserRoles from "@/types/enums/userRoles";
import Previous_Work from "@/models/Previous_work";

// CUD for work experiences
// Read is mostly like not needed as it will be viewed along side the profile, so the logic for that is moved down there
// *depends on frontend implementation tho
export const createPreviousWorkService = async (title: String, place: String, from: Date, to: Date): Promise<any> => {
  if (!title || !place || !from || !to) throw new Error("One of the fields is empty");
  const newWorkExperience = await Previous_Work.create({ title, place, from, to });
  return new response(true, newWorkExperience, "Work experience created successfully!", 200);
};

export const updatePreviousWorkService = async (_id: ObjectId, title: String, place: String, from: Date, to: Date): Promise<any> => {
  const previousWork = await Previous_Work.findById(_id);
  if (!previousWork) throw new Error("Previous work not found");

  // this is to prevent empty data from overwriting the old data
  if (!title) title = previousWork.title;
  if (!place) place = previousWork.place;
  if (!from) from = previousWork.from;
  if (!to) to = previousWork.to;

  const updatedPreviousWork = await Previous_Work.findByIdAndUpdate(_id, { title, place, from, to }, { new: true });
  return new response(true, updatedPreviousWork, "Previous work updated!", 200);
};

export const deletePreviousWorkService = async (_id: ObjectId) => {
  if (!_id) throw new Error("_id is required");
  if (!Types.ObjectId.isValid(_id.toString())) throw new Error("_id is invalid");

  const deletedPreviousWork = await Previous_Work.findByIdAndDelete(_id);
  if (!deletedPreviousWork) throw new Error("Previous work not found");
  return new response(true, deletedPreviousWork, "Previous work deleted!", 200);
};
// CRUD for tour guide profile
export const getProfileService = async (_id: ObjectId): Promise<any> => {
  if (!_id) throw new Error("_id is required");
  if (!Types.ObjectId.isValid(_id.toString())) throw new Error("_id is invalid");
  const tourGuideProfile = await Tour_Guide.findById(_id);
  return new response(true, tourGuideProfile, "Tour guide profile", 200);
};

export const updateProfileService = async (
  years_of_experience: Number,
  previous_work_description: [ObjectId],
  photo: String,
  user_id: ObjectId,
  tour_guide_id: ObjectId
): Promise<any> => {
  const user = await User.findById(user_id).select("status role");
  if (user) {
    const isAccepted = user.status;
    const role = user.role;
    if (!isAccepted) throw new Error("The tour guide has not been accepted by an admin yet");
    if (role !== UserRoles.TourGuide) throw new Error("This user is not a tour guide");
  } else {
    throw new Error("This user is not registered to our system?? This error should never be thrown :)");
  }

  const tourGuide = await Tour_Guide.findById(tour_guide_id);
  if (tourGuide) {
    // this checks if any of the fields are empty; so that if they are empty they are
    //  kept as is in the database and not overwritten to also be empty
    if (!photo) photo = tourGuide.photo;
    // if (!years_of_experience)
    //   years_of_experience = tourGuide.years_of_experience;
    // if (!previous_work_description)
    //   previous_work_description = tourGuide.previous_work_description;
    const updatedProfile = await Tour_Guide.findByIdAndUpdate(
      tour_guide_id,
      { photo, years_of_experience, previous_work_description },
      { new: true }
    );
    return new response(true, updatedProfile, "Profile updated successfully!", 200);
  }
  throw new Error("Tour guide profile not found. This error should never be thrown :)");
};
