import { Farmer, FarmerWithId } from "../modules/interfaces/farmer";
import { Location } from "../modules/interfaces/location";

export const userSchema = {
  type: "object",
  properties: {
    _id: {
      type: "string",
      example: "677164acd5343f0dac83716a"
    },
    email: {
      type: "string",
      example: "admin@example.com"
    },
    role: {
      type: "string",
      example: "admin"
    },
    name: {
      type: "string",
      example: "Alice"
    },
    surname: {
      type: "string",
      example: "Smith"
    },
    location: {
      oneOf: [
        {$ref: "#/components/schemas/location"},
        {type: "null"}
      ]
    }
  }
}
const userLocationExample: Location = {place: "500 E Memorial Rd, Oklahoma City", postCode: "73114 OK", country: "USA" }
export const userExample = {_id: "295394acd5343f0dac837163", email: "admin@example.com", role: "admin", name: "Alice", surname: "Smith", location: userLocationExample}
