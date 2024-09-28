import {getUserService,createUserService,updateUserService} from "../services/userService";

export const getUser = async (req: any, res: any) => {getUserService(req,res);};
export const createUser = async (req: any, res: any) => {createUserService(req,res)};
export const updateUser = async (req: any, res: any) => {updateUserService(req,res)};

