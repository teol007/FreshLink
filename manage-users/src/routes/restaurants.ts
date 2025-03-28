import { Request, Response, Router } from "express";
import { getDb } from "../modules/database";
import { ObjectId } from "mongodb";
import { BSONError } from "bson";
import bcrypt from "bcryptjs";
import { generateRestaurantToken } from "../modules/functions/jwt";
import { authorizeRoles } from "../modules/middleware/authorizationJWT";
import { JwtPayloadRole } from "../modules/interfaces/jwtPayload";
import { Restaurant, RestaurantWithId } from "../modules/interfaces/restaurant";

const router = Router();

const collection = "restaurants";


router.get('/', authorizeRoles([JwtPayloadRole.ADMIN, JwtPayloadRole.RESTAURANT, JwtPayloadRole.FARMER]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/restaurants/'
  // #swagger.tags = ["Restaurants"]
  // #swagger.summary = "Get all restaurants"
  // #swagger.description = "Returns a list of all restaurants"
  // #swagger.responses[200] = {description: "Successful response with a list of restaurants", content: {"application/json": {schema: {type: "array", items: {$ref: '#/components/schemas/restaurant'}}, examples: {example1: {$ref: '#/components/examples/arrayOfRestaurants'}}}}}
  // #swagger.responses[500] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {example1: {$ref: '#/components/examples/error500'}}}}}
    
  console.log(`GET /restaurants endpoint was called`);
  try {
    const restaurants = await getDb().collection(collection).find({}).toArray();
    const restaurantsWithoutPasswords = restaurants.map((restaurant) => {
      const { password, ...restaurantWithoutPassword } = restaurant;
      return restaurantWithoutPassword;
    });
    return res.status(200).json(restaurantsWithoutPasswords);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get('/:id', authorizeRoles([JwtPayloadRole.ADMIN, JwtPayloadRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/restaurants/{id}'
  // #swagger.tags = ["Restaurants"]
  // #swagger.summary = "Get restaurant by id"
  // #swagger.description = "Returns restaurant object with specified id"
  // #swagger.parameters['id'] = { description: "Restaurant ID", required: true, type: "string" }
  // #swagger.responses[200] = { description: "Successful response with a restaurant object", content: {"application/json": {schema: {$ref: '#/components/schemas/restaurant'}, examples: {example1: {$ref: '#/components/examples/restaurant'}}}}}
  // #swagger.responses[404] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Object not found": {value: {message: "Object with id '678938800c96e28d11883a6e' does not exist"}}}}}}
  // #swagger.responses[400] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Invalid ID format": {value: {message: "Id is incorrect"}}}}}}
  // #swagger.responses[500] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {example1: {$ref: '#/components/examples/error500'}}}}}
  
  console.log(`GET /restaurants/${req.params.id} endpoint was called`);
  try {
    const id = req.params.id;
    const _id = new ObjectId(id);
    const object = await getDb().collection(collection).findOne({ _id: _id });
    if (!object)
      return res.status(404).json({ message: `Object with id '${id}' does not exist` });

    const { password, ...objectWithoutPassword } = object;
    return res.status(200).json(objectWithoutPassword);
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof BSONError)
      return res.status(400).json({ message: "Id is incorrect" });

    return res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post('/', async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/restaurants/'
  // #swagger.tags = ["Restaurants"]
  // #swagger.summary = "Register a new restaurant"
  // #swagger.description = "Adds a new restaurant"
  /* #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {$ref: "#/components/hiddenSchemas/postRestaurant"},
           examples: {example1: {$ref: "#/components/examples/postRestaurant"}}
         }
       }
     } */
  // #swagger.responses[200] = {description: "Restaurant created successfully", content: {"application/json": {schema: {$ref: '#/components/schemas/restaurant'}, examples: {example1: {$ref: '#/components/examples/restaurant'}}}}}
  // #swagger.responses[422] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Missing required properties": {value: {message: "All required properties must be defined"}}}}}}
  // #swagger.responses[409] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Already exists": {value: {message: "Email already exists"}}}}}}
  // #swagger.responses[500] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {example1: {$ref: '#/components/examples/error500'}}}}}
  
  console.log(`POST /restaurants endpoint was called`);
  try {
    const body = req.body;

    if (!body.email || !body.password || !body.name || !body.description || !body.location.place || !body.location.postCode || !body.location.country || !body.phoneNumber || !body.rating)
      return res.status(422).json({ message: "All required properties must be defined" });

    const restaurant: Restaurant = {
      email: body.email,
      password: body.password,
      name: body.name,
      description: body.description,
      location: {
        place: body.location.place,
        postCode: body.location.postCode,
        country: body.location.country
      },
      phoneNumber: body.phoneNumber,
      rating: body.rating
    };

    const isAlreadyRegistered = await getDb().collection(collection).findOne({ email: restaurant.email });
    if(isAlreadyRegistered)
      return res.status(409).json({ message: "Email already exists" });

    restaurant.password = await bcrypt.hash(restaurant.password, 5);
    const result = await getDb().collection(collection).insertOne(restaurant);
    const insertedObject = await getDb().collection(collection).findOne({ _id: result.insertedId });
    if(!insertedObject)
      return res.status(500).json({ message: "Internal Server Error" });

    const { password, ...objectWithoutPassword } = insertedObject;
    return res.status(200).json(objectWithoutPassword);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


router.put('/:id', authorizeRoles([JwtPayloadRole.ADMIN, JwtPayloadRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/restaurants/{id}'
  // #swagger.tags = ["Restaurants"]
  // #swagger.summary = "Update a restaurant"
  // #swagger.description = "Updates an existing restaurant's details. Email can not be changed."
  // #swagger.parameters['id'] = { description: "Restaurant ID", required: true, type: "string" }
  /* #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {$ref: "#/components/hiddenSchemas/restaurantWithoutId"},
           examples: {example1: {$ref: "#/components/examples/restaurantWithoutId"}}
         }
       }
     } */
  // #swagger.responses[200] = {description: "Restaurant updated successfully", content: {"application/json": {schema: {$ref: '#/components/schemas/restaurant'}, examples: {example1: {$ref: '#/components/examples/restaurant'}}}}}
  // #swagger.responses[422] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Missing required properties": {value: {message: "All required properties must be defined"}}}}}}
  // #swagger.responses[404] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Object not found": {value: {message: "Object with id '678938800c96e28d11883a6e' does not exist"}}}}}}
  // #swagger.responses[400] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Invalid ID format": {value: {message: "Id is incorrect"}}}}}}
  // #swagger.responses[500] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {example1: {$ref: '#/components/examples/error500'}}}}}
  
  console.log(`PUT /restaurants/${req.params.id} endpoint was called`);
  try {
    const id = req.params.id;
    const _id = new ObjectId(id);

    const body = req.body;

    if (!body.email || !body.name || !body.description || !body.location.place || !body.location.postCode || !body.location.country || !body.phoneNumber || !body.rating)
      return res.status(422).json({ message: "All required properties must be defined" });

    const restaurant: Omit<Restaurant, "password" | "email"> = {
      name: body.name,
      description: body.description,
      location: {
        place: body.location.place,
        postCode: body.location.postCode,
        country: body.location.country
      },
      phoneNumber: body.phoneNumber,
      rating: body.rating
    };

    const updatedObject = await getDb().collection(collection).findOneAndUpdate({ _id: _id }, { $set: restaurant }, { returnDocument: 'after' });
    if (!updatedObject)
      return res.status(404).json({ message: `Object with id '${id}' does not exist` });

    const { password, ...objectWithoutPassword } = updatedObject!;
    return res.status(200).json(objectWithoutPassword);
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof BSONError)
      return res.status(400).json({ message: "Id is incorrect" });

    return res.status(500).json({ message: "Internal Server Error" });
  }
});


router.delete('/:id', authorizeRoles([JwtPayloadRole.ADMIN, JwtPayloadRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/restaurants/{id}'
  // #swagger.tags = ["Restaurants"]
  // #swagger.summary = "Delete a restaurant"
  // #swagger.description = "Deletes a restaurant"
  // #swagger.parameters['id'] = { description: "Restaurant ID", required: true, type: "string" }
  // #swagger.responses[200] = {description: "Restaurant successfully deleted", content: {"application/json": {schema:{type:"object",properties:{message:{type:"string", example:"Successfully deleted"}}}, examples: {"Success": {value: {message: "Successfully deleted"}}}}}}
  // #swagger.responses[404] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Object not found": {value: {message: "Object with id '678938800c96e28d11883a6e' does not exist"}}}}}}
  // #swagger.responses[400] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Invalid ID format": {value: {message: "Id is incorrect"}}}}}}
  // #swagger.responses[500] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {example1: {$ref: '#/components/examples/error500'}}}}}

  console.log(`DELETE /restaurants/${req.params.id} endpoint was called`);
  try {
    const id = req.params.id;
    const _id = new ObjectId(id);
    const result = await getDb().collection(collection).deleteOne({ _id: _id });
    if (result.deletedCount !== 1)
      return res.status(404).json({ message: `Object with id '${id}' does not exist` });

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof BSONError)
      return res.status(400).json({ message: "Id is incorrect" });

    return res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post('/login', async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/restaurants/login'
  // #swagger.tags = ["Restaurants"]
  // #swagger.summary = "Login a restaurant"
  // #swagger.description = "Authenticates a restaurant and returns a JWT token and restaurant details"
  /* #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { type: "object", properties: { email: { type: "string" }, password: { type: "string" } } },
          examples: {
            example1: {
              summary: "A sample restaurant login",
              value: {
                email: "evala@example.com",
                password: "pass123"
              }
            }
          }
        }
      }
     } */
  // #swagger.responses[200] = {description: "Restaurant logged in successfully", content: {"application/json": {schema:{type:"object",properties:{token:{type:"string", example:"your-jwt-token"},restaurant:{$ref:"#/components/schemas/restaurant"}}}, examples: {example1: {$ref: '#/components/examples/loginRestaurantResponse'}}}}}
  // #swagger.responses[422] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Missing required properties": {value: {message: "All required properties must be defined"}}}}}}
  // #swagger.responses[401] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Invalid credentials": {value: {message: "Invalid email or password"}}}}}}
  // #swagger.responses[500] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {example1: {$ref: '#/components/examples/error500'}}}}}

  console.log(`GET /restaurants/login endpoint was called`);
  const { email, password: inputPassword } = req.body;

  if (!email || !inputPassword)
    return res.status(422).json({ message: "All required properties must be defined" });

  try {
    const restaurantDoc = await getDb().collection(collection).findOne({ email });
    if(!restaurantDoc)
      return res.status(401).json({ message: "Invalid email or password" });

    const restaurant: RestaurantWithId = {
      _id: restaurantDoc._id.toString(),
      email: restaurantDoc.email,
      password: restaurantDoc.password,
      name: restaurantDoc.name,
      description: restaurantDoc.description,
      location: {
        place: restaurantDoc.location.place,
        postCode: restaurantDoc.location.postCode,
        country: restaurantDoc.location.country
      },
      phoneNumber: restaurantDoc.phoneNumber,
      rating: restaurantDoc.rating
    };

    const isPasswordValid = await bcrypt.compare(inputPassword, restaurant.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = generateRestaurantToken(restaurant)
    const { password, ...restaurantWithoutPassword } = restaurant;
    return res.status(200).json({ token: token, restaurant: restaurantWithoutPassword });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
