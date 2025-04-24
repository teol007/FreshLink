export const locationSchema = {
  type: "object",
  properties: {
    place: {
      type: "string",
      example: "1424 Cornwall Ave, Bellingham"
    },
    postCode: {
      type: "string",
      example: "98225 WA"
    },
    country: {
      type: "string",
      example: "USA"
    }
  }
}
