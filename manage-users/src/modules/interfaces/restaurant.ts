import { Location } from "./location";

export interface Restaurant {
    email: string;
    password: string;
    name: string;
    description: string;
    location: Location;
    phoneNumber: string;
    rating: number; 
}

export interface RestaurantWithId extends Restaurant {
    _id: string;
}
