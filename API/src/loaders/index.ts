import mongooseLoader from "./moongose";
import Logger from "./logger";
import dependencyInjectorLoader from "./dependencyInjector";
import jobsLoader from "./jobs";
import expressLoader from "./express";
import { Application } from "express";
import { gridfsLoader } from "./gridfs";
import { name } from "agenda/dist/agenda/name";

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
    model: require("../models/Activity").default,
  };
  const advertiserModel = {
    name: "advertiserModel",
    // Notice the require syntax and the '.default'
    model: require("../models/Advertiser").default,
  };
  const bookmark_notifyModel = {
    name: "bookmark_notifyModel",
    // Notice the require syntax and the '.default'
    model: require("../models/Bookmark_notify").default,
  };
  const categoryModel = {
    name: "categoryModel",
    // Notice the require syntax and the '.default'
    model: require("../models/Category").default,
  };

  const comment_ratingModel = {
    name: "comment_ratingModel",
    // Notice the require syntax and the '.default'
    model: require("../models/Comment_rating").default,
  };

  const complaintModel = {
    name: "complaintModel",
    // Notice the require syntax and the '.default'
    model: require("../models/Complaint").default,
  };

  const governorModel = {
    name: "governorModel",
    // Notice the require syntax and the '.default'
    model: require("../models/Governor").default,
  };
  const historical_locationModel = {
    name: "historical_locationModel",
    // Notice the require syntax and the '.default'
    model: require("../models/Historical_location").default,
  };
  const itineraryModel = {
    name: "itineraryModel",
    // Notice the require syntax and the '.default'
    model: require("../models/Itinerary").default,
  };
  const orderModel = {
    name: "orderModel",
    // Notice the require syntax and the '.default'
    model: require("../models/Order").default,
  };
  const previous_workModel = {
    name: "previous_workModel",
    // Notice the require syntax and the '.default'
    model: require("../models/Previous_work").default,
  };
  const productModel = {
    name: "productModel",
    // Notice the require syntax and the '.default'
    model: require("../models/Product").default,
  };
  const promo_codeModel = {
    name: "promo_codeModel",
    // Notice the require syntax and the '.default'
    model: require("../models/Promo_code").default,
  };
  const sellerModel = {
    name: "sellerModel",
    // Notice the require syntax and the '.default'
    model: require("../models/Seller").default,
  };
  const slotModel = {
    name: "slotModel",
    // Notice the require syntax and the '.default'
    model: require("../models/Slot").default,
  };
  const ticketModel = {
    name: "ticketModel",
    // Notice the require syntax and the '.default'
    model: require("../models/Ticket").default,
  };
  const tour_guideModel = {
    name: "tour_guideModel",
    // Notice the require syntax and the '.default'
    model: require("../models/Tour_guide").default,
  };
  const touristModel = {
    name: "touristModel",
    // Notice the require syntax and the '.default'
    model: require("../models/Tourist").default,
  };
  const historical_tagModel = {
    name: "historical_tagModel",
    // Notice the require syntax and the '.default'
    model: require("../models/Historical_tag").default,
  };
  const tagModel = {
    name: "tagModel",
    model: require("../models/Tag").default,
  };

  const otpModel = {
    name: "otpModel",
    model: require("../models/OTP").default,
  };
  const cartModel = {
    name: "cartModel",
    model: require("../types/Cart").default,
  };

  const { gfs, upload } = await gridfsLoader({ mongoConnection });
  Logger.info("✌️ GridFS loaded");
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
      tagModel,
      historical_tagModel,
      otpModel,
      cartModel,
    ],
    gfs,
    upload,
  });

  Logger.info("✌️ Dependency Injector loaded");

  await jobsLoader({ agenda });
  Logger.info("✌️ Jobs loaded");

  await expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");
};
