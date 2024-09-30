import { HttpError, InternalServerError } from "../types/Errors";
import response from "../types/responses/response";
import { Inject, Service } from "typedi";
import { IUserInputDTO } from "@/interfaces/IUser";

@Service()
export default class UserService {
  constructor(@Inject("userModel") private userModel: Models.UserModel) {}

  public async createUserService(userData: IUserInputDTO) {
    const newUser = new this.userModel(userData);
    if (newUser instanceof Error)
      throw new InternalServerError("Internal server error");
    // throw new Error ("Internal server error");
    if (newUser == null) throw new HttpError("User not created", 404);
    // throw new Error("User not created");
    await newUser.save();
    return new response(true, newUser, "User created", 200);
  }
}
