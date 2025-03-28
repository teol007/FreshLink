import { Location } from "../modules/interfaces/location";
import { Restaurant } from "../modules/interfaces/restaurant";

export const postRestaurantSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      example: "evala@example.com"
    },
    password: {
      type: "string",
      example: "pass123"
    },
    name: {
      type: "string",
      example: "Evala"
    },
    description: {
      type: "string",
      example: "A cozy spot offering delicious food."
    },
    location: {
      $ref: "#/components/schemas/location"
    },
    phoneNumber: {
      type: "string",
      example: "+123456789012"
    },
    rating: {
      type: "number",
      example: 4.5
    }
  }
};

export const restaurantSchema = {
  type: "object",
  properties: {
    _id: {
      type: "string",
      example: "678938800c96e28d11883a6e"
    },
    email: {
      type: "string",
      example: "evala@example.com"
    },
    name: {
      type: "string",
      example: "Evala"
    },
    description: {
      type: "string",
      example: "A cozy spot offering delicious food."
    },
    location: {
      $ref: "#/components/schemas/location"
    },
    phoneNumber: {
      type: "string",
      example: "+123456789012"
    },
    rating: {
      type: "number",
      example: 4.5
    }
  }
};

export const restaurantWithoutIdSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      example: "evala@example.com"
    },
    name: {
      type: "string",
      example: "Evala"
    },
    description: {
      type: "string",
      example: "A cozy spot offering delicious food."
    },
    location: {
      $ref: "#/components/schemas/location"
    },
    phoneNumber: {
      type: "string",
      example: "+123456789012"
    },
    rating: {
      type: "number",
      example: 4.5
    }
  }
};

const restaurantLocationExample: Location = {place: "201 N Walker Ave, Oklahoma City", postCode: "73102 OK", country: "USA"}
export const postRestaurantExample: Restaurant = {email: "evala@example.com", password: "pass123", name: "Evala", description: "A cozy spot offering delicious food.", location: restaurantLocationExample, phoneNumber: "+123456789012", rating: 4.5}
export const restaurantExample = {_id: "678938800c96e28d11883a6e", email: "evala@example.com", name: "Evala", description: "A cozy spot offering delicious food.", location: restaurantLocationExample, phoneNumber: "+123456789012", rating: 4.5}
export const restaurantWithoutIdExample = {email: "evala@example.com", name: "Evala", description: "A cozy spot offering delicious food.", location: restaurantLocationExample, phoneNumber: "+123456789012", rating: 4.5}
