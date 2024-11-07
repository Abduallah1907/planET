import config from "@/config";
import UserRoles from "@/types/enums/userRoles";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function getRoleAndID(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // pray this works pls
  if (!config.jwtSecret) {
    res.status(500).send("Server error: JWT secret is not defined");
    return;
  }
  // since the tourist sees the same thing as a guest, the default is tourist
  let userRole = UserRoles.Tourist;
  let userId = null;
  let stakeHolderId = null;
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token)
    jwt.verify(token, config.jwtSecret, (err, decoded: any) => {
      if (err) return res.status(401).send("Unauthorized");
      userRole = decoded.role;
      stakeHolderId = decoded.stakeholder_id;
      userId = decoded.id;
    });

  req.body.user_id = userId;
  req.body.stakeholder_id = stakeHolderId;
  req.body.role = userRole;
  next();
}

export default getRoleAndID;
