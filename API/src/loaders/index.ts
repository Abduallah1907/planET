import mongooseLoader from "./moongose";
import Logger from "./logger";
import dependencyInjectorLoader from "./dependencyInjector";
import jobsLoader from "./jobs";
import expressLoader from "./express";
import { Application } from "express";

export default async ({ expressApp }: { expressApp: Application }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info("✌️ DB loaded and connected!");

  /**
   * WTF is going on here?
   *
   * We are injecting the mongoose models into the DI container.
   * I know this is controversial but will provide a lot of flexibility at the time
   * of writing unit tests, just go and check how beautiful they are!
   */
  //models
  const userModel = {
    name: "userModel",
    // Notice the require syntax and the '.default'
    model: require("../models/user").default,
  };
  const activityModel = {
    name: "activityModel",
    // Notice the require syntax and the '.default'
    model: require("../models/activity").default,
  };
  const advertiserModel = {
    name: "advertiserModel",
    // Notice the require syntax and the '.default'
    model: require("../models/advertiser").default,
  };
  const bookmark_notifyModel = {
    name: "bookmark_notifyModel",
    // Notice the require syntax and the '.default'
    model: require("../models/bookmark_notify").default,
  };
  const categoryModel = {
    name: "categoryModel",
    // Notice the require syntax and the '.default'
    model: require("../models/category").default,
  };

  const comment_ratingModel = {
    name: "comment_ratingModel",
    // Notice the require syntax and the '.default'
    model: require("../models/comment_rating").default,
  };

  const complaintModel = {
    name: "complaintModel",
    // Notice the require syntax and the '.default'
    model: require("../models/complaint").default,
  };

  const governorModel = {
    name: "governorModel",
    // Notice the require syntax and the '.default'
    model: require("../models/governor").default,
  };
  const historical_locationModel = {
    name: "historical_locationModel",
    // Notice the require syntax and the '.default'
    model: require("../models/historical_location").default,
  };
  const itineraryModel = {
    name: "itineraryModel",
    // Notice the require syntax and the '.default'
    model: require("../models/itinerary").default,
  };
  const orderModel = {
    name: "orderModel",
    // Notice the require syntax and the '.default'
    model: require("../models/order").default,
  };
  const previous_workModel = {
    name: "previous_workModel",
    // Notice the require syntax and the '.default'
    model: require("../models/previous_work").default,
  };
  const productModel = {
    name: "productModel",
    // Notice the require syntax and the '.default'
    model: require("../models/product").default,
  };
  const promo_codeModel = {
    name: "promo_codeModel",
    // Notice the require syntax and the '.default'
    model: require("../models/promo_code").default,
  };
  const sellerModel = {
    name: "sellerModel",
    // Notice the require syntax and the '.default'
    model: require("../models/seller").default,
  };
  const slotModel = {
    name: "slotModel",
    // Notice the require syntax and the '.default'
    model: require("../models/slot").default,
  };
  const ticketModel = {
    name: "ticketModel",
    // Notice the require syntax and the '.default'
    model: require("../models/ticket").default,
  };
  const tour_guideModel = {
    name: "tour_guideModel",
    // Notice the require syntax and the '.default'
    model: require("../models/tour_guide").default,
  };
  const touristModel = {
    name: "touristModel",
    // Notice the require syntax and the '.default'
    model: require("../models/tourist").default,
  };
  const wishlistModel = {
    name: "wishlistModel",
    // Notice the require syntax and the '.default'
    model: require("../models/wishlist").default,
  };

  // It returns the agenda instance because it's needed in the subsequent loaders
  const { agenda } = await dependencyInjectorLoader({
    mongoConnection,
    models: [
      userModel,
      activityModel,
      advertiserModel,
      bookmark_notifyModel,
      categoryModel,
      comment_ratingModel,
      complaintModel,
      governorModel,
      historical_locationModel,
      itineraryModel,
      orderModel,
      previous_workModel,
      productModel,
      promo_codeModel,
      sellerModel,
      slotModel,
      ticketModel,
      tour_guideModel,
      touristModel,
      wishlistModel,
    ],
  });
  Logger.info("✌️ Dependency Injector loaded");

  await jobsLoader({ agenda });
  Logger.info("✌️ Jobs loaded");

  await expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");
};
