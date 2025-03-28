import jwt from "jsonwebtoken";
import { FarmerWithId } from "../interfaces/farmer";
import { RestaurantWithId } from "../interfaces/restaurant";
import dotenv from 'dotenv';
import { JwtPayload, JwtPayloadRole } from "../interfaces/jwtPayload";
import { UserWithId } from "../interfaces/users";

dotenv.config();

const secretKey = process.env.UMS_JWT_SECRET_KEY || "";
if(secretKey === "")
    throw Error("UMS_JWT_SECRET_KEY is not defined as enviroment variable")

const issuer = "FreshLink";

function issuedAt(): number {
    return Math.floor(Date.now() / 1000)
}

function expirationTime(): number {
    return Math.floor(Date.now() / 1000) + 60 * 60 * 24; // Token expiration (1 days)
}

export function generateFarmerToken(farmer: FarmerWithId): string {
    const payload: JwtPayload = {
        sub: farmer._id,
        name: farmer.name + farmer.surname,
        role: JwtPayloadRole.FARMER,
        iat: issuedAt(),
        exp: expirationTime(),
        iss: issuer,
    };

    return jwt.sign(payload, secretKey);
}

export function generateRestaurantToken(restaurant: RestaurantWithId): string {
    const payload: JwtPayload = {
        sub: restaurant._id,
        name: restaurant.name,
        role: JwtPayloadRole.RESTAURANT,
        iat: issuedAt(),
        exp: expirationTime(),
        iss: issuer,
    };

    return jwt.sign(payload, secretKey);
}

export function generateUserToken(user: UserWithId): string {
    const payload: JwtPayload = {
        sub: user._id,
        name: user.name + user.surname,
        role: user.role,
        iat: issuedAt(),
        exp: expirationTime(),
        iss: issuer,
    };

    return jwt.sign(payload, secretKey);
}

export const verifyToken = (token: string): jwt.JwtPayload | string => {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
};
