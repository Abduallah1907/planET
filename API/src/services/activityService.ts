import response from "@/types/responses/response";
import { Inject, Service } from "typedi";

@Service()
export default class ActivityService {
  constructor(
    @Inject("activityModel") private activityModel: Models.ActivityModel
  ) {}

  public getAllActivitiesService = async () => {
    const activities = await this.activityModel.find({});
    return new response(true, activities, "All activites are fetched", 200);
  };
}
