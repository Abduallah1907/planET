import { ISellerInputDTO, ISellerOutputDTO } from "@/interfaces/ISeller";
import UserRoles from "@/types/enums/userRoles";
import response from "@/types/responses/response";
import { InternalServerError, NotFoundError } from "@/types/Errors";
import Container, { Inject, Service } from "typedi";
import { IUserInputDTO } from "@/interfaces/IUser";
import UserService from "./userService";
import { ISellerUpdateDTO } from "@/interfaces/ISeller";

@Service()
export default class SellerService {
  constructor(
    @Inject("sellerModel") private sellerModel: Models.SellerModel,
    @Inject("userModel") private userModel: Models.UserModel
  ) {}
  //input email of seller retrun seller data
  public async getSellerService(email: string) {
    const user = await this.userModel.findOne({
      email: email,
      role: UserRoles.Seller,
    });
    if (user instanceof Error)
      throw new InternalServerError("Internal server error");
    // throw new Error ("Internal server error");

    if (user == null) throw new NotFoundError("User not found");
    // throw new Error("User not found");

    const seller = await this.sellerModel.findOne({ user_id: user._id });
    if (seller == null) throw new NotFoundError("Seller not found");
    // throw new Error("Seller not found");

    if (seller instanceof Error)
      throw new InternalServerError("Internal server error");
    // throw new Error("Internal server error");

    const sellerOutput: ISellerOutputDTO = {
      email: user.email,
      name: user.name,
      username: user.username,
      phone_number: user.phone_number,
      logo: seller.logo,
      description: seller.description,
    };
    return new response(true, sellerOutput, "Seller found", 200);
  }
  //Any seller need to be cerated as a user first role seller so we need to call createUserService first then seller will be created
  public async createSellerService(newSellerData: ISellerInputDTO) {
    const userData: IUserInputDTO = {
      email: newSellerData.email,
      name: newSellerData.name,
      username: newSellerData.username,
      password: newSellerData.password,
      role: UserRoles.Seller,
      phone_number: newSellerData.phone_number,
      date_of_birth: newSellerData.date_of_birth,
    };
    const userService: UserService = Container.get(UserService);
    const newUserResponse = await userService.createUserService(userData);

    const newUser = new this.userModel(newUserResponse.data);
    newUser.role = UserRoles.Seller;
    newUser.save();
    if (newUser instanceof Error)
      throw new InternalServerError("Internal server error");

    if (newUser == null) throw new NotFoundError("User not found");
    const newSeller = new this.sellerModel({
      user_id: newUser._id,
      documents_required: newSellerData.documents_required,
      logo: newSellerData.logo,
    });

    await newSeller.save();

    const sellerOutput: ISellerOutputDTO = {
      email: newUser.email,
      name: newUser.name,
      username: newUser.username,
      phone_number: newUser.phone_number,
      logo: newSeller.logo,
      description: newSeller.description,
    };
    return new response(true, sellerOutput, "Seller created", 201);
  }

  //Takes old and new name and description of seller
  public async updateSellerService(
    searchEmail: string,
    updatedSellerData: ISellerUpdateDTO
  ) {
    const { name, email, description } = updatedSellerData;
    const user = await this.userModel.findOneAndUpdate(
      { searchEmail, role: UserRoles.Seller },
      { name: name, email: email },
      { new: true }
    );
    if (user instanceof Error)
      throw new InternalServerError("Internal server error");
    if (user == null) throw new NotFoundError("User not found");

    const updatedSeller = await this.sellerModel.findOneAndUpdate(
      { user_id: user._id },
      { description: description },
      { new: true }
    );

    if (updatedSeller instanceof Error)
      throw new InternalServerError("Internal server error");
    if (updatedSeller == null) throw new NotFoundError("Seller not found");

    const sellerOutput: ISellerOutputDTO = {
      email: user.email,
      name: user.name,
      username: user.username,
      phone_number: user.phone_number,
      logo: updatedSeller.logo,
      description: updatedSeller.description,
    };
    return new response(true, sellerOutput, "Seller updated", 200);
  }
}
