export const errorSchema = {
  type: "object",
  properties: {
    message: {
      type: "string",
      example: "Example error message",
    }
  }
}

export const error500Example = {message: "Internal Server Error"}
