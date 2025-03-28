import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../functions/jwt";
import { JwtPayload } from "../interfaces/jwtPayload";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  // #swagger.responses[401] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Token": {value: {message: "No token provided"}}}}}}
  // #swagger.responses[403] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Token": {value: {message: "Invalid or expired token"}}}}}}
  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("API endpoint that requires JWT was called without a token. Ignoring request...");
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.split(" ")[1] : authHeader;
  try {
    const decoded = verifyToken(token);
    req.user = decoded as JwtPayload;
    next();
  } catch (err) {
    console.log("API endpoint that requires JWT was called with invalid or expired token. Ignoring request...");
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }
};
