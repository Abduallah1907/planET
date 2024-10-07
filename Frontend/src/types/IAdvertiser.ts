import { IUser } from "./IUser";

export interface IAdvertiser  {
  email: string;
  name: string;
  username: string;
  password: string;
  phone_number: string;
  activities: string[];
  documents_required: string[];
  link_to_website: string;
  hotline: string;
  about: string;
  logo: string;
  company_profile: string;
  user_id : IUser;
}
export interface IAdvertiserCreateDTO {
  user_id: IUser;
  activities: string[];
  documents_required: string[];
  link_to_website: string;
  hotline: string;
  about: string;
  logo: string;
  company_profile: string;
}

export interface IAdvertiserUpdateDTO {
  activities?: string[];
  link_to_website?: string;
  hotline?: string;
  about?: string;
  logo?: string;
  company_profile?: string;
  user_id?: IUser;
}
