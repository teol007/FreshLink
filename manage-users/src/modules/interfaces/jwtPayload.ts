export enum JwtPayloadRole {
    FARMER = "farmer",
    RESTAURANT = "restaurant",
    ADMIN = "admin",
    UNSPECIFIED = "unspecified"
}

export interface JwtPayload {
    sub: string;
    name: string;
    role: JwtPayloadRole;
    iat: number,
    exp: number,
    iss: string,
}
