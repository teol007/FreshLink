import { JwtPayloadRole } from "./jwtPayload";
import { Location } from "./location";

export interface User {
    email: string;
    password: string;
    role: JwtPayloadRole;
    name: string;
    surname: string;
    location: Location | undefined;
}

export interface UserWithId extends User {
    _id: string;
}
