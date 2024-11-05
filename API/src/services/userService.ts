import { BadRequestError, HttpError, InternalServerError, NotFoundError } from "../types/Errors";
import response from "../types/responses/response";
import Container, { Inject, Service } from "typedi";
import { IGovernorUpdateDTO, IUserInputDTO, IUserLoginDTO, IUserLoginOutputDTO } from "@/interfaces/IUser";
import UserRoles from "@/types/enums/userRoles";
import UserStatus from "@/types/enums/userStatus";
import jwt, { Algorithm } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "@/config";
import { ObjectId, Types } from "mongoose";
import MailerService from "./mailer";

@Service()
export default class UserService {
  constructor(
    @Inject("userModel") private userModel: Models.UserModel,
    @Inject("sellerModel") private sellerModel: Models.SellerModel,
    @Inject("touristModel") private touristModel: Models.TouristModel,
    @Inject("advertiserModel") private advertiserModel: Models.AdvertiserModel,
    @Inject("tour_guideModel") private tourGuideModel: Models.Tour_guideModel,
    @Inject("governorModel") private governorModel: Models.GovernorModel,
    @Inject("otpModel") private otpModel: Models.OTPModel
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
    newUser.password = await bcrypt.hash(userData.password, parseInt(newUser.salt));

    if (newUser instanceof Error) throw new InternalServerError("Internal server error");
    // throw new Error ("Internal server error");
    if (newUser == null) throw new HttpError("User not created", 404);
    // throw new Error("User not created");
    if (userData.role == UserRoles.Admin || userData.role == UserRoles.Governor || userData.role == UserRoles.Tourist) {
      newUser.status = UserStatus.APPROVED;
    }
    await newUser.save();
    return new response(true, newUser, "User created", 201);
  }

  public async loginUserService(loginData: IUserLoginDTO) {
    let user;
    if (!loginData.username) {
      user = await this.userModel.findOne({ email: loginData.email });
    } else {
      user = await this.userModel.findOne({
        username: loginData.username,
      });
    }
    if (user instanceof Error) throw new InternalServerError("Internal server error");

    if (!user) throw new NotFoundError("User not found");

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) throw new BadRequestError("Password is incorrect");

    const user_id = user._id;
    const role = user.role;
    let stakeholder_id;
    switch (role) {
      case UserRoles.Admin:
        
      case UserRoles.Seller:
        const seller = await this.sellerModel.findOne({ user_id: user_id });
        if (seller instanceof Error) throw new InternalServerError("Internal server error");
        if (seller == null) throw new NotFoundError("Seller not found");
        stakeholder_id = seller;
        break;

      case UserRoles.Tourist:
        const tourist = await this.touristModel.findOne({ user_id: user_id });
        if (tourist instanceof Error) throw new InternalServerError("Internal server error");
        if (tourist == null) throw new NotFoundError("Tourist not found");
        stakeholder_id = tourist;
        break;

      case UserRoles.Advertiser:
        const advertiser = await this.advertiserModel.findOne({
          user_id: user_id,
        });
        if (advertiser instanceof Error) throw new InternalServerError("Internal server error");
        if (advertiser == null) throw new NotFoundError("Advertiser not found");
        stakeholder_id = advertiser;
        break;

      case UserRoles.TourGuide:
        const tourGuide = await this.tourGuideModel.findOne({ user_id: user_id }).populate("previous_work_description");
        if (tourGuide instanceof Error) throw new InternalServerError("Internal server error");
        if (tourGuide == null) throw new NotFoundError("Tour Guide not found");
        stakeholder_id = tourGuide;
        break;

      case UserRoles.Governor:
        const governor = await this.governorModel.findOne({ user_id: user_id });
        if (governor instanceof Error) throw new InternalServerError("Internal server error");
        if (governor == null) throw new NotFoundError("Governor not found");
        stakeholder_id = governor;
        break;
    }

    const token = jwt.sign(
      {
        id: user._id?.toString(), // Ensure _id is a string
        role: user.role,
        stakeholder_id: stakeholder_id?.toString(), // Ensure stakeholder_id is a string
      },
      config.jwtSecret as string,
      {
        expiresIn: "1h",
        algorithm: (config.jwtAlgorithm as Algorithm) || "HS256",
      }
    );

    const userOutput: IUserLoginOutputDTO = {
      _id: user._id as ObjectId,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      phone_number: user.phone_number,
      status: user.status,
      first_time_login: user.first_time_login,
      stakeholder_id: stakeholder_id,
      token: token,
    };
    user.first_time_login = false;
    await user.save();

    return new response(true, userOutput, "User found", 200);
  }

  public async forgetPasswordService(email: string) {
    const mailerServiceInstance = Container.get(MailerService);
    const user = await this.userModel.findOne({ email: email });
    if (user instanceof Error) throw new InternalServerError("Internal server error");
    if (user == null) throw new NotFoundError("User not found");

    // Send email with reset password link

    const mailSent = mailerServiceInstance.SendPasswordReminderEmail(user);

    if ((await mailSent).status == "error") {
      throw new InternalServerError("Internal server error while sending email or email not valid");
    }
    return new response(true, user, "Email sent", 200);
  }

  public async updateGovernorService(email: string, updateData: IGovernorUpdateDTO) {
    const { newEmail, name, phone_number, password, nation } = updateData;
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10); // Await bcrypt.hash here
    }

    const updatedUser = await this.userModel.findOneAndUpdate(
      { email: email, role: UserRoles.Governor },
      {
        email: newEmail,
        name: name,
        phone_number: phone_number,
        password: hashedPassword,
      },
      { new: true }
    );
    if (updatedUser instanceof Error) throw new InternalServerError("Internal server error");
    if (updatedUser == null) throw new NotFoundError("User not found");

    const updatedGovernor = await this.governorModel.findOneAndUpdate({ user_id: updatedUser._id }, { nation: nation }, { new: true });
    if (updatedGovernor instanceof Error) throw new InternalServerError("Internal server error");

    if (updatedGovernor == null) throw new NotFoundError("Governor not found");

    const updatedGovernorOutput: IGovernorUpdateDTO = {
      newEmail: updatedUser.email,
      name: updatedUser.name,
      phone_number: updatedUser.phone_number,
      password: updatedUser.password,
      nation: updatedGovernor.nation,
    };
    return new response(true, updatedGovernorOutput, "Governor updated", 200);
  }

  public async requestOTPService(email: string) {
    const mailerServiceInstance = Container.get(MailerService);
    const user = await this.userModel.findOne({ email: email });
    if (user instanceof Error) throw new InternalServerError("Internal server error");
    if (user == null) throw new NotFoundError("User not found");

    const sentOTPs = await this.otpModel.find({ user_id: user._id });
    if (sentOTPs.length > 3) {
      throw new BadRequestError("Too many OTPs sent. Please try again later");
    }

    // Send email with OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const createdOTP = await this.otpModel.create({
      user_id: user._id,
      code: otp,
    });
    if (createdOTP instanceof Error) throw new InternalServerError("Internal server error");
    const mailSent = mailerServiceInstance.sendOTPMail(email, otp);

    if ((await mailSent).status == "error") {
      throw new InternalServerError("Internal server error while sending email or email not valid");
    }
    return new response(true, user, "Email sent", 200);
  }

  public async verifyOTPService(email: string, otp: string) {
    const user = await this.userModel.findOne({ email: email });
    if (user instanceof Error) throw new InternalServerError("Internal server error");
    if (user == null) throw new NotFoundError("User not found");

    const sentOTPs = await this.otpModel.find({ user_id: user._id }).sort({ createdAt: 1 });
    if (sentOTPs.length == 0) {
      throw new BadRequestError("No OTPs sent. Please request an OTP first");
    }
    const lastOTP = sentOTPs[sentOTPs.length - 1];
    if (lastOTP.code != otp) {
      throw new BadRequestError("Incorrect OTP");
    }
    const currentTime = new Date().getTime();
    const otpTime = lastOTP.createdAt.getTime();
    if (currentTime - otpTime > 600000) {
      throw new BadRequestError("OTP expired. Please request a new OTP");
    }
    return new response(true, user, "OTP verified", 200);
  }

  public async resetPasswordService(email: string, password: string, otp: string) {
    const user = await this.userModel.findOne({ email: email });
    if (user instanceof Error) throw new InternalServerError("Internal server error");
    if (user == null) throw new NotFoundError("User not found");

    const sentOTPs = await this.otpModel.find({ user_id: user._id }).sort({ createdAt: 1 });
    const lastOTP = sentOTPs[sentOTPs.length - 1];
    if (lastOTP.code != otp) {
      throw new BadRequestError("Incorrect OTP");
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return new response(true, user, "Password reset", 200);
  }

  public async getDocumentsRequiredService(user_id: Types.ObjectId, role: UserRoles) {
    let user;
    switch (role) {
      case UserRoles.Admin:
      case UserRoles.Seller:
        user = await this.sellerModel.findOne({ user_id: user_id });
        break;

      case UserRoles.Tourist:
        user = await this.touristModel.findOne({ user_id: user_id });
        break;

      case UserRoles.Advertiser:
        user = await this.advertiserModel.findOne({ user_id: user_id });
        break;

      case UserRoles.TourGuide:
        user = await this.tourGuideModel.findOne({ user_id: user_id });
        break;

      case UserRoles.Governor:
        user = await this.governorModel.findOne({ user_id: user_id });
        break;
      default:
        throw new BadRequestError("Invalid role");
    }
    if (user instanceof Error) throw new InternalServerError("Internal server error");
    if (user == null) throw new NotFoundError("User not found");

    const documents_required = user.documents_required;
    return new response(true, documents_required, "Documents returned for user", 200);
  }
}
