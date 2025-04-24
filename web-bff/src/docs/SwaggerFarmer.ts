import { Farmer } from "../modules/interfaces/farmer";
import { Location } from "../modules/interfaces/location";

export const postFarmerSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      example: "john.doe@example.com"
    },
    password: {
      type: "string",
      example: "password123"
    },
    farmName: {
      type: "string",
      example: "Doe's Farm"
    },
    description: {
      type: "string",
      example: "A nice farm"
    },
    name: {
      type: "string",
      example: "John"
    },
    surname: {
      type: "string",
      example: "Doe"
    },
    location: {
      $ref: "#/components/schemas/location"
    }
  }
}

export const farmerSchema = {
  type: "object",
  properties: {
    _id: {
      type: "string",
      example: "677164acd5343f0dac83716a"
    },
    email: {
      type: "string",
      example: "john.doe@example.com"
    },
    farmName: {
      type: "string",
      example: "Doe's Farm"
    },
    description: {
      type: "string",
      example: "A nice farm"
    },
    name: {
      type: "string",
      example: "John"
    },
    surname: {
      type: "string",
      example: "Doe"
    },
    location: {
      $ref: "#/components/schemas/location"
    }
  }
}

export const farmerWithoutIdSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      example: "john.doe@example.com"
    },
    farmName: {
      type: "string",
      example: "Doe's Farm"
    },
    description: {
      type: "string",
      example: "A nice farm"
    },
    name: {
      type: "string",
      example: "John"
    },
    surname: {
      type: "string",
      example: "Doe"
    },
    location: {
      $ref: "#/components/schemas/location"
    }
  }
}

const farmerLocationExample: Location = {place: "3124 MontvaleDr, Springfield", postCode: "62704 IL", country: "USA" }
export const postFarmerExample: Farmer = {email: "john.doe@example.com", password: "password123", farmName: "Doe's Farm", description: "A nice farm.", name: "John", surname: "Doe", location: farmerLocationExample}
export const farmerExample = {_id: "677164acd5343f0dac83716a", email: "john.doe@example.com", farmName: "Doe's Farm", description: "A nice farm.", name: "John", surname: "Doe", location: farmerLocationExample}
export const farmerWithoutIdExample = {email: "john.doe@example.com", farmName: "Doe's Farm", description: "A nice farm.", name: "John", surname: "Doe", location: farmerLocationExample}
