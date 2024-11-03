import config from "@/config";
import UserRoles from "@/types/enums/userRoles";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

function getRoleAndID(req: Request, res: Response, next: NextFunction) {
  if (!config.jwtSecret) {
    return res.status(500).send("Server error: JWT secret is not defined");
  }
  // since the tourist sees the same thing as a guest, the default is tourist
  let userRole = UserRoles.Tourist;
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token)
    jwt.verify(token, config.jwtSecret, (err, decoded: any) => {
      if (err) return res.status(401).send("Unauthorized");

      const userId = decoded.id;
      req.body.userId = userId;
      userRole = decoded.role;
      console.log(userId, userRole);
    });

  console.log(userRole);
  req.body.userRole = userRole;
  next();
}
