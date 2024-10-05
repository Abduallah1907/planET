import { expressjwt as jwt } from "express-jwt";
import { Request, Response, NextFunction } from "express";
import { Algorithm } from "jsonwebtoken";
import dotenv from "dotenv";
import express from "express";
import { Router } from "express";
import { Container } from "typedi";
import { TouristController } from "../controllers/touristController";

dotenv.config();

const app = express();

/**
 * We are assuming that the JWT will come in a header with the form
 *
 * Authorization: Bearer ${JWT}
 *
 * But it could come in a query parameter with the name that you want like
 * GET https://my-bulletproof-api.com/stats?apiKey=${JWT}
 * Luckily this API follow _common sense_ ergo a _good design_ and don't allow that ugly stuff
 */
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

const isAuth = jwt({
  secret: process.env.JWT_SECRET || "defaultSecret", // The _secret_ to sign the JWTs
  algorithms: [process.env.JWT_ALGORITHM as Algorithm], // JWT Algorithm
  requestProperty: "token", // Use req.token to store the JWT
  getToken: getTokenFromHeader, // How to extract the JWT from the request
});

export default isAuth;
