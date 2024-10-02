import { IActivityDTO } from "../../interfaces/IActivity";
import Container, { Service } from "typedi";
import ActivityService from "@/services/activityService";

@Service()
export class ActivityController {
  //Create activity
  public async createActivity(req: any, res: any) {
    const activityService: ActivityService = Container.get(ActivityService);
    const activityData = req.body as IActivityDTO;
    const activity = await activityService.createActivityService(activityData);
    res.status(activity.status).json({ activity });
  }

  //Get all Acivites in the DB
  public async getAllActivities(req: any, res: any) {
    const activityService: ActivityService = Container.get(ActivityService);
    const activities = await activityService.getAllActivitiesService();
    res.status(activities.status).json({ activities });
  }
  //Get activity using ID
  public async getActivityByID(req: any, res: any) {
    const { id } = req.params;
    const activityService: ActivityService = Container.get(ActivityService);
    const activity = await activityService.getActivityByIDService(id);
    res.status(activity.status).json({ activity });
  }
  public async getActivityByAdvertiserID(req: any, res: any) {
    const { advertiserID } = req.params
    const activityService: ActivityService = Container.get(ActivityService);
    const activity = await activityService.getActivityByAdvertiserIDService(advertiserID);
    res.status(activity.status).json({ activity });
  }
  public async updateActivity(req: any, res: any) {
    const { id} = req.params;
    const activityService: ActivityService = Container.get(ActivityService);
    const activity = await activityService.updateActivityService(id,req.body.activityData);
    res.status(activity.status).json({ activity });
  }

  public async deleteActivity(req: any, res: any) {
    const { id } = req.params;
    const activityService: ActivityService = Container.get(ActivityService);
    const activity = await activityService.deleteActivityService(id);
    res.status(activity.status).json({ activity });
  }
}
