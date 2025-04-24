import { Location } from "./location";

export interface Farmer {
    email: string;
    password: string;
    farmName: string;
    description: string;
    name: string;
    surname: string;
    location: Location;
}

export interface FarmerWithId extends Farmer {
    _id: string;
}
