import config from "@/config";
import UserRoles from "@/types/enums/userRoles";
import e from "cors";
import { NextFunction, Request, Response } from "express";
import { InternalServerError, UnauthorizedError } from "@/types/Errors";
import { verify } from "jsonwebtoken";

const getTokenFromHeader = (req: Request): string | undefined => {
  /**
   * @TODO Edge and Internet Explorer do some weird things with the headers
   * So I believe that this should handle more 'edge' cases ;)
   */
  if (
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Token")) ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer"))
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return undefined;
};
function authorize(roles: string[] = []) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (config.env === "development") {
      next();
      return;
    } else {
      const token = getTokenFromHeader(req);
      if (!token) {
        throw new UnauthorizedError("Unauthorized token not found");
      }
      if (!config.jwtSecret) {
        throw new InternalServerError("Internal server error");
      }
      verify(token, config.jwtSecret, (err, decoded: any) => {
        if (err || !decoded) {
          throw new UnauthorizedError("Unauthorized token not valid");
        }
        if (!decoded.role) {
          throw new UnauthorizedError("Unauthorized role not found");
        }
        const { role } = decoded;
        if (role === UserRoles.Admin) {
          next();
        } else {
          if (roles.indexOf(role) === -1) {
            throw new UnauthorizedError("Unauthorized role");
          }
          next();
        }
      });
    }
  };
}
export default authorize;
