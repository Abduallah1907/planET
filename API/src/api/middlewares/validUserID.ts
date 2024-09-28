import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
const validUserID = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { id } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "No such user" });
  next();
};

export default validUserID;
