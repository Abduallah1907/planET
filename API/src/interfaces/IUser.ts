import UserRoles from "@/types/enums/userRoles";
import UserStatus from "@/types/enums/userStatus";

export interface IUser {
  name: string;
  username: string;
  email: string;
  password: string;
  salt: string;
  role: UserRoles;
  phone_number: string;
  first_time_login: boolean;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

// this interace is used whenever the admin creates an account for another person (governor or admin)
export interface IUserAdminCreate {
  email: string;
  name: string;
  phone_number: string;
  username: string;
  password: string;
}
// this interface is used anytime an admin views the users
export interface IUserAdminViewDTO {
  name: string;
  username: string;
  email: string;
  role: UserRoles;
  phone_number: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}
export interface IUserInputDTO {
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRoles;
}
