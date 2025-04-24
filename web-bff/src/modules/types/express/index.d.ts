import {Express} from "express-serve-static-core";
import { JwtUserRole } from "../../interfaces/jwtPayload";

declare module 'express-serve-static-core' {
    interface Request {
      userRole?: JwtUserRole;
    }
}
