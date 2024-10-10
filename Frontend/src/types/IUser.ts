import UserRoles from "./userRoles";
import UserStatus from "./userStatus";

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

// this interace is used whenever the admin creates another admin
export interface IUserAdminCreateAdminDTO {
  email: string;
  name: string;
  phone_number: string;
  username: string;
  password: string;
}

// this interace is used whenever the admin creates a new governor
export interface IUserAdminCreateGovernorDTO {
  email: string;
  name: string;
  phone_number: string;
  username: string;
  password: string;
  nation: string;
}
// this interface is used anytime an admin views the users
export interface IUserAdminViewDTO {
  _id: string;
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
  phone_number: string;
}

export interface IUserCreateDTO {
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRoles;
  phone_number: string;
}

export interface IUserOutputDTO {
  name: string;
  username: string;
  email: string;
  role: UserRoles;
  phone_number: string;
}
export interface IUserLoginDTO {
  email?: string;
  username?: string;
  password: string;
}
export interface IUserLoginOutputDTO {
  name: string;
  username: string;
  email: string;
  role: UserRoles;
  phone_number: string;
  status: UserStatus;
  first_time_login: boolean;
  stakeholder_id: string;
  token: string;
}

export interface IUserManagmentDTO{
  _id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  status: string;
}
