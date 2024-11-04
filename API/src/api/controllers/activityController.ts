import { IActivityDTO } from "../../interfaces/IActivity";
import Container, { Service } from "typedi";
import { Request, Response } from "express";
import ActivityService from "@/services/activityService";
import { Types } from "mongoose";

@Service()
export class ActivityController {
  //Create activity
  public async createActivity(req: any, res: any) {
    const activityService: ActivityService = Container.get(ActivityService);
    const activityData = req.body as IActivityDTO;
    const activity = await activityService.createActivityService(activityData);
    res.status(activity.status).json(activity);
  }

  //Get all Acivites in the DB
  public async getAllActivities(req: any, res: any) {
    const activityService: ActivityService = Container.get(ActivityService);
    const { role } = req.body;
    const activities = await activityService.getAllActivitiesService(role);
    res.status(activities.status).json(activities);
  }
  //Get activity using ID
  public async getActivityByID(req: any, res: any) {
    const { id } = req.params;
    const activityService: ActivityService = Container.get(ActivityService);
    const activity = await activityService.getActivityByIDService(id);
    res.status(activity.status).json(activity);
  }
  public async getActivitiesByAdvertiserID(req: any, res: any) {
    const { advertiserID } = req.params;
    const activityService: ActivityService = Container.get(ActivityService);
    const activity = await activityService.getActivitiesByAdvertiserIDService(advertiserID);
    res.status(activity.status).json(activity);
  }
  public async updateActivity(req: any, res: any) {
    const { id } = req.params;
    const activityService: ActivityService = Container.get(ActivityService);
    const activityData = req.body as IActivityDTO;
    const activity = await activityService.updateActivityService(id, activityData);
    res.status(activity.status).json(activity);
  }

  public async deleteActivity(req: any, res: any) {
    const { id } = req.params;
    const activityService: ActivityService = Container.get(ActivityService);
    const activity = await activityService.deleteActivityService(id);
    res.status(activity.status).json(activity);
  }

  public async getSearchActivity(req: any, res: any) {
    const { name, category, tag } = req.query;
    const { role } = req.body;
    const activityService: ActivityService = Container.get(ActivityService);
    const activities = await activityService.getSearchActivityService(name, category, tag, role);
    res.status(activities.status).json(activities);
  }

  public async getUpcomingActivities(req: any, res: any) {
    const activityService: ActivityService = Container.get(ActivityService);
    const { role } = req.body;
    const upcomingActivities = await activityService.getUpcomingActivitiesService(role);

    res.status(upcomingActivities.status).json(upcomingActivities);
  }

  public async getFilteredActivities(req: any, res: any) {
    const { price, date, category, rating, tag, advertiser_id } = req.query;
    const { role } = req.body;
    const activityService: ActivityService = Container.get(ActivityService);
    var filters = {};
    if (price)
      if (price.includes("-")) {
        filters = {
          ...filters,
          price: {
            min: parseFloat(price.split("-")[0]),
            max: parseFloat(price.split("-")[1]),
          },
        };
      } else {
        filters = {
          ...filters,
          price: {
            max: parseFloat(price),
          },
        };
      }
    if (date) {
      const [start, end] = date.split("-");
      filters = { ...filters, date: { start, end: end || start } };
    }
    if (category) {
      const categoryList = category.split(",").map((cat: string) => cat.trim());
      filters = { ...filters, category: categoryList };
    }
    if (tag) {
      const preferencesList = tag.split(",").map((preference: string) => preference.trim());
      filters = { ...filters, preferences: preferencesList };
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
    if (advertiser_id) filters = { ...filters, advertiser_id: advertiser_id };
    const activities = await activityService.getFilteredActivitiesService(filters, role);
    res.status(activities.status).json(activities);
  }
  public async getSortedActivities(req: any, res: any) {
    const { sort, direction } = req.query;
    const { role } = req.body;
    const activityService: ActivityService = Container.get(ActivityService);
    const activities = await activityService.getSortedActivitiesService(sort, direction, role);
    res.status(activities.status).json(activities);
  }
  public async getFilterComponents(req: any, res: any) {
    const { role } = req.body;
    const activityService: ActivityService = Container.get(ActivityService);
    const filterComponents = await activityService.getFilterComponentsService(role);
    res.status(filterComponents.status).json(filterComponents);
  }

  public async flagActivity(req: Request, res: Response): Promise<any> {
    const { activity_id } = req.params;
    const activity_idObjectId = new Types.ObjectId(activity_id);

    const activityService: ActivityService = Container.get(ActivityService);
    const updatedActivity = await activityService.flagActivityInappropriateService(activity_idObjectId);
    res.status(updatedActivity.status).json(updatedActivity);
  }
}
