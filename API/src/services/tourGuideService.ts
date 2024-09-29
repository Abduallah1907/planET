import Tour_Guide from "@/models/Tour_guide";
import { ObjectId } from "mongoose";
import response from "@/types/responses/response";
import User from "@/models/user";
import UserRoles from "@/types/enums/userRoles";
import Previous_Work from "@/models/Previous_work";

// CRUD for work experiences
export const createPreviousWorkService = async (title: String, place: String, from: Date, to: Date): Promise<any> => {
  if (!title || !place || !from || !to) throw new Error("One of the fields is empty");
  const newWorkExperience = await Previous_Work.create({
    title,
    place,
    from,
    to,
  });
  return new response(true, newWorkExperience, "Work experience created successfully!", 200);
};
// CRUD for tour guide profile
// TODO update the user first_login boolean
export const viewProfileService = async (user_id: ObjectId): Promise<any> => {};

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
