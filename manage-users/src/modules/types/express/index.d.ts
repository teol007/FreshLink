import {Express} from "express-serve-static-core";
import { JwtPayload } from "../../interfaces/jwtPayload";

declare module 'express-serve-static-core' {
    interface Request {
      user?: JwtPayload;
    }
}
