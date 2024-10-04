import {
  BadRequestError,
  HttpError,
  InternalServerError,
  NotFoundError,
} from "../types/Errors";
import response from "../types/responses/response";
import { Inject, Service } from "typedi";
import { IUserInputDTO, IUserLoginDTO } from "@/interfaces/IUser";
import UserRoles from "@/types/enums/userRoles";
import UserStatus from "@/types/enums/userStatus";
import { log } from "console";

@Service()
export default class UserService {
  constructor(
    @Inject("userModel") private userModel: Models.UserModel,
    @Inject("sellerModel") private sellerModel: Models.SellerModel,
    @Inject("touristModel") private touristModel: Models.TouristModel,
    @Inject("advertiserModel") private advertiserModel: Models.AdvertiserModel,
    @Inject("tour_guideModel") private tourGuideModel: Models.Tour_guideModel,
    @Inject("governorModel") private governorModel: Models.GovernorModel
  ) {}

  public async createUserService(userData: IUserInputDTO) {
    // const phoneNumRegex =
    //   /^\+\d{1,3}[\s-]?(\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,9})$/;
    // if (!phoneNumRegex.test(userData.phone_number))
    //   throw new BadRequestError("Invalid phone number");
    // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // if (!emailRegex.test(userData.email))
    //   throw new BadRequestError("Invalid email");
    const newUser = new this.userModel(userData);
    if (newUser instanceof Error)
      throw new InternalServerError("Internal server error");
    // throw new Error ("Internal server error");
    if (newUser == null) throw new HttpError("User not created", 404);
    // throw new Error("User not created");
    await newUser.save();
    return new response(true, newUser, "User created", 201);
  }

  public async loginUserService(loginData: IUserLoginDTO) {
    let user;
    if (loginData.username == null) {
      user = await this.userModel.findOne({ email: loginData.email });
    } else {
      user = await this.userModel.findOne({
        username: loginData.username,
      });
    }

    if (user instanceof Error)
      throw new InternalServerError("Internal server error");

    if (user == null) throw new NotFoundError("User not found");
    // throw new Error("User not found");
    if (user.password !== loginData.password)
      throw new BadRequestError("Password is incorrect");

    const user_id = user._id;
    const role = user.role;
    switch (role) {
      case UserRoles.Seller:
        const seller = await this.sellerModel.findOne({ user_id });
        if (seller instanceof Error)
          throw new InternalServerError("Internal server error");
        if (seller == null) throw new NotFoundError("Seller not found");
        return new response(true, seller, "Seller found", 200);

      case UserRoles.Tourist:
        const tourist = await this.touristModel.findOne({ user_id });
        if (tourist instanceof Error)
          throw new InternalServerError("Internal server error");
        if (tourist == null) throw new NotFoundError("Tourist not found");
        return new response(true, tourist, "Tourist found", 200);

      case UserRoles.Advertiser:
        const advertiser = await this.advertiserModel.findOne({ user_id });
        if (advertiser instanceof Error)
          throw new InternalServerError("Internal server error");
        if (advertiser == null) throw new NotFoundError("Advertiser not found");
        return new response(true, advertiser, "Advertiser found", 200);

      case UserRoles.TourGuide:
        const tourGuide = await this.tourGuideModel.findOne({ user_id });
        if (tourGuide instanceof Error)
          throw new InternalServerError("Internal server error");
        if (tourGuide == null) throw new NotFoundError("Tour Guide not found");
        return new response(true, tourGuide, "Tour Guide found", 200);

      case UserRoles.Governor:
        const governor = await this.governorModel.findOne({ user_id });
        if (governor instanceof Error)
          throw new InternalServerError("Internal server error");
        if (governor == null) throw new NotFoundError("Governor not found");
        return new response(true, governor, "Governor found", 200);
    }

    return new response(true, user, "User found", 200);
  }
}
