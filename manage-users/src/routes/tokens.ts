import { Request, Response, Router } from "express";
import { getDb } from "../modules/database";
import { verifyToken } from "../modules/functions/jwt";
import { JwtPayload, JwtPayloadRole } from "../modules/interfaces/jwtPayload";
import { ObjectId } from "mongodb";

const router = Router();

router.post('/authenticate', async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/tokens/authenticate'
  // #swagger.tags = ["Tokens"]
  // #swagger.summary = "Authenticates token"
  // #swagger.description = "Authenticates JWT token and returns data from token"
  /* #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { type: "object", properties: {token:{type: "string"}}},
          examples: {
            example1: {
              summary: "A sample token",
              value: {
                token: "your-jwt-token",
              }
            }
          }
        }
      }
     } */
  // #swagger.responses[200] = { description: "Token is valid", content: {"application/json": {schema:{type:"object",properties:{role:{type:"string", example:"farmer"},object:{oneOf: [{$ref:"#/components/schemas/farmer"},{$ref:"#/components/schemas/restaurant"},{$ref:"#/components/hiddenSchemas/user"}]}}}, examples: {example1: {$ref: '#/components/examples/authenticateFarmer'}, example2: {$ref: '#/components/examples/authenticateRestaurant'}, example3: {$ref: '#/components/examples/authenticateUser'}}}}}
  // #swagger.responses[403] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Token": {value: {message: "Invalid or expired token"}}}}}}
  // #swagger.responses[401] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Fake token": {value: {message: "Token does not belong to the user"}}}}}}
  // #swagger.responses[500] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {example1: {$ref: '#/components/examples/error500'}}}}}
  
  console.log(`POST tokens/authenticate endpoint was called`);
  const { token } = req.body;
  let decodedToken: JwtPayload | undefined = undefined;

  try {
    decodedToken = verifyToken(token) as JwtPayload;
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }

  try {
    let collection = "users";
    if(decodedToken.role === JwtPayloadRole.FARMER)
      collection = "farmers"
    else if(decodedToken.role === JwtPayloadRole.RESTAURANT)
      collection = "restaurants"

    const userDoc = await getDb().collection(collection).findOne({ _id: new ObjectId(decodedToken.sub) });
    if(!userDoc)
      return res.status(401).json({ message: "Token does not belong to the user" });

    const { password, ...objectWithoutPassword } = userDoc;
    return res.status(200).json({ role: decodedToken.role, object: objectWithoutPassword });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
