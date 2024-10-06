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
    const { advertiserID } = req.params;
    const activityService: ActivityService = Container.get(ActivityService);
    const activity = await activityService.getActivityByAdvertiserIDService(
      advertiserID
    );
    res.status(activity.status).json({ activity });
  }
  public async updateActivity(req: any, res: any) {
    const { id } = req.params;
    const activityService: ActivityService = Container.get(ActivityService);
    const activityData = req.body as IActivityDTO;
    const activity = await activityService.updateActivityService(
      id,
      activityData
    );
    res.status(activity.status).json({ activity });
  }

  public async deleteActivity(req: any, res: any) {
    const { id } = req.params;
    const activityService: ActivityService = Container.get(ActivityService);
    const activity = await activityService.deleteActivityService(id);
    res.status(activity.status).json({ activity });
  }

  public async getActivity(req: any, res: any) {
    const { name, category, tag } = req.query;
    const activityService: ActivityService = Container.get(ActivityService);
    const activities = await activityService.getActivityService(
      name,
      category,
      tag
    );
    res.status(activities.status).json({ activities });
  }

  public async getUpcomingActivities(req: any, res: any) {
    const activityService: ActivityService = Container.get(ActivityService);
    const upcomingActivities =
      await activityService.getUpcomingActivitiesService();

    res.status(upcomingActivities.status).json({ upcomingActivities });
  }

  public async getFilteredActivities(req: any, res: any) {
    const { budget, date, category, rating } = req.query;
    const activityService: ActivityService = Container.get(ActivityService);
    var filters = {};
    if (budget)
      if (budget.includes("-")) {
        filters = {
          ...filters,
          price: {
            min: parseFloat(budget.split("-")[0]),
            max: parseFloat(budget.split("-")[1]),
          },
        };
      } else {
        filters = {
          ...filters,
          price: {
            max: parseFloat(budget),
          },
        };
      }
    if (date) filters = { ...filters, date: { start: date } };
    if (category) {
      const categoryList = category.split(",").map((cat: string) => cat.trim());
      filters = { ...filters, category: categoryList };
    }

    if (rating) {
      if (rating.includes("-")) {
        filters = {
          ...filters,
          rating: {
            min: parseFloat(rating.split("-")[0]),
            max: parseFloat(rating.split("-")[1]),
          },
        };
      } else {
        filters = {
          ...filters,
          rating: {
            min: parseFloat(rating),
          },
        };
      }
    }
    const activities = await activityService.getFilteredActivitiesService(
      filters
    );
    res.status(activities.status).json({ activities });
  }
  public async getSortedActivities(req: any, res: any) {
    const { sort, direction } = req.query;
    const activityService: ActivityService = Container.get(ActivityService);
    const activities = await activityService.getSortedActivitiesService(
      sort,
      direction
    );
    res.status(activities.status).json({ activities });
  }
}
