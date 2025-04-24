import { Request, Response, NextFunction, RequestHandler } from "express";
import { JwtUserRole } from "../interfaces/jwtPayload";
import { manageUsersBaseUrl } from "../config";

const authenticateUrl = manageUsersBaseUrl + "/tokens/authenticate"

export const authorizeRoles = (roles: JwtUserRole[]): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // #swagger.responses[401] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"No token": {value: {message: "No token provided"}}, "JWT payload": {value: {message: "Cannot parse JWT payload"}}}}}}
    // #swagger.responses[403] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Bad token": {value: {message: "Invalid or expired token"}}, "Role": {value: {message: "Your role does not have access"}}}}}}

    const authHeader = req.headers.authorization ?? "";
    const token = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.split(" ")[1] : authHeader;
    if (!token) {
      console.log(`API endpoint '${req.baseUrl}' that requires JWT was called without a token. Ignoring request...`);
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const response = await fetch(authenticateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token: token })
    });

    const responseJson = await response.json();
    if(response.status !== 200) {
      res.status(response.status).json(responseJson);
      return;
    }

    const userRole = responseJson.role as JwtUserRole;
    if (!userRole) {
      console.log(`API endpoint '${req.baseUrl}' that requires JWT was called with token that could not be parsed. Ignoring request...`);
      res.status(401).json({ message: "Cannot parse JWT payload" });
      return;
    }

    if (!roles.includes(userRole)) {
      res.status(403).json({ message: "Your role does not have access" });
      return;
    }

    next();
  };
};
