import { Request, Response, NextFunction, RequestHandler } from "express";
import { JwtPayloadRole } from "../interfaces/jwtPayload";
import { authenticateJWT } from "./authenticationJWT";

export const authorizeRoles = (roles: JwtPayloadRole[]): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Includes HTTP codes for authenticateJWT function:
    // #swagger.responses[401] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"No token": {value: {message: "No token provided"}}, "JWT payload": {value: {message: "Cannot parse JWT payload"}}}}}}
    // #swagger.responses[403] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Bad token": {value: {message: "Invalid or expired token"}}, "Role": {value: {message: "Your role does not have access"}}}}}}
    
    try {
      await new Promise<void>((resolve, reject) => {
        authenticateJWT(req, res, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    } catch (error) {
      // If authenticateJWT fails, return its error response.
      return;
    }

    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Cannot parse JWT payload" });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({ message: "Your role does not have access" });
      return;
    }

    next();
  };
};
