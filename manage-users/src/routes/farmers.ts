import { Request, Response, Router } from "express";
import { getDb } from "../modules/database";
import { Farmer, FarmerWithId } from "../modules/interfaces/farmer";
import { ObjectId } from "mongodb";
import { BSONError } from "bson";
import bcrypt from "bcryptjs";
import { generateFarmerToken } from "../modules/functions/jwt";
import { authorizeRoles } from "../modules/middleware/authorizationJWT";
import { JwtPayloadRole } from "../modules/interfaces/jwtPayload";

const router = Router();

const collection = "farmers";


router.get('/', authorizeRoles([JwtPayloadRole.ADMIN, JwtPayloadRole.FARMER, JwtPayloadRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/farmers/'
  // #swagger.tags = ["Farmers"]
  // #swagger.summary = "Get all farmers"
  // #swagger.description = "Returns a list of all farmers"
  // #swagger.responses[200] = {description: "Successful response with a list of farmers", content: {"application/json": {schema: {type: "array", items: {$ref: '#/components/schemas/farmer'}}, examples: {example1: {$ref: '#/components/examples/arrayOfFarmers'}}}}}
  // #swagger.responses[500] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {example1: {$ref: '#/components/examples/error500'}}}}}
  
  console.log(`GET /farmers endpoint was called`);
  try {
    const farmers = await getDb().collection(collection).find({}).toArray();
    const farmersWithoutPasswords = farmers.map((farmer) => {
      const { password, ...farmerWithoutPassword } = farmer;
      return farmerWithoutPassword;
    });
    return res.status(200).json(farmersWithoutPasswords);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get('/:id', authorizeRoles([JwtPayloadRole.ADMIN, JwtPayloadRole.FARMER, JwtPayloadRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/farmers/{id}'
  // #swagger.tags = ["Farmers"]
  // #swagger.summary = "Get farmer by id"
  // #swagger.description = "Returns farmer object with specified id"
  // #swagger.parameters['id'] = { description: "Farmer ID", required: true, type: "string" }
  // #swagger.responses[200] = { description: "Successful response with a farmer object", content: {"application/json": {schema: {$ref: '#/components/schemas/farmer'}, examples: {example1: {$ref: '#/components/examples/farmer'}}}}}
  // #swagger.responses[404] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Object not found": {value: {message: "Object with id '677164acd5343f0dac83716a' does not exist"}}}}}}
  // #swagger.responses[400] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Invalid ID format": {value: {message: "Id is incorrect"}}}}}}
  // #swagger.responses[500] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {example1: {$ref: '#/components/examples/error500'}}}}}
  
  console.log(`GET /farmers/${req.params.id} endpoint was called`);
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
  // #swagger.path = '/farmers/'
  // #swagger.tags = ["Farmers"]
  // #swagger.summary = "Register a new farmer"
  // #swagger.description = "Adds a new farmer"
  /* #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {$ref: "#/components/hiddenSchemas/postFarmer"},
           examples: {example1: {$ref: "#/components/examples/postFarmer"}}
         }
       }
     } */
  // #swagger.responses[200] = {description: "Farmer created successfully", content: {"application/json": {schema: {$ref: '#/components/schemas/farmer'}, examples: {example1: {$ref: '#/components/examples/farmer'}}}}}
  // #swagger.responses[422] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Missing required properties": {value: {message: "All required properties must be defined"}}}}}}
  // #swagger.responses[409] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Already exists": {value: {message: "Email already exists"}}}}}}
  // #swagger.responses[500] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {example1: {$ref: '#/components/examples/error500'}}}}}
  
  console.log(`POST /farmers endpoint was called`);
  try {
    const body = req.body;

    if (!body.email || !body.password || !body.farmName || !body.description || !body.name || !body.surname || !body.location.place || !body.location.postCode || !body.location.country)
      return res.status(422).json({ message: "All required properties must be defined" });

    const farmer: Farmer = {
      email: body.email,
      password: body.password,
      farmName: body.farmName,
      description: body.description,
      name: body.name,
      surname: body.surname,
      location: {
        place: body.location.place,
        postCode: body.location.postCode,
        country: body.location.country
      }
    };

    const isAlreadyRegistered = await getDb().collection(collection).findOne({ email: farmer.email });
    if(isAlreadyRegistered)
      return res.status(409).json({ message: "Email already exists" });

    farmer.password = await bcrypt.hash(farmer.password, 5);
    const result = await getDb().collection(collection).insertOne(farmer);
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


router.put('/:id', authorizeRoles([JwtPayloadRole.ADMIN, JwtPayloadRole.FARMER]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/farmers/{id}'
  // #swagger.tags = ["Farmers"]
  // #swagger.summary = "Update a farmer"
  // #swagger.description = "Updates an existing farmer's details. Email can not be changed."
  // #swagger.parameters['id'] = { description: "Farmer ID", required: true, type: "string" }
  /* #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {$ref: "#/components/hiddenSchemas/farmerWithoutId"},
           examples: {example1: {$ref: "#/components/examples/farmerWithoutId"}}
         }
       }
     } */
  // #swagger.responses[200] = {description: "Farmer updated successfully", content: {"application/json": {schema: {$ref: '#/components/schemas/farmer'}, examples: {example1: {$ref: '#/components/examples/farmer'}}}}}
  // #swagger.responses[422] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Missing required properties": {value: {message: "All required properties must be defined"}}}}}}
  // #swagger.responses[404] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Object not found": {value: {message: "Object with id '677164acd5343f0dac83716a' does not exist"}}}}}}
  // #swagger.responses[400] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Invalid ID format": {value: {message: "Id is incorrect"}}}}}}
  // #swagger.responses[500] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {example1: {$ref: '#/components/examples/error500'}}}}}
  
  console.log(`PUT /farmers/${req.params.id} endpoint was called`);
  try {
    const id = req.params.id;
    const _id = new ObjectId(id);

    const body = req.body;

    if (!body.email || !body.farmName || !body.description || !body.name || !body.surname || !body.location.place || !body.location.postCode || !body.location.country)
      return res.status(422).json({ message: "All required properties must be defined" });

    const farmer: Omit<Farmer, "password" | "email"> = {
      farmName: body.farmName,
      description: body.description,
      name: body.name,
      surname: body.surname,
      location: {
        place: body.location.place,
        postCode: body.location.postCode,
        country: body.location.country
      }
    };

    const updatedObject = await getDb().collection(collection).findOneAndUpdate({ _id: _id }, { $set: farmer }, { returnDocument: 'after' });
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


router.delete('/:id', authorizeRoles([JwtPayloadRole.ADMIN, JwtPayloadRole.FARMER]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/farmers/{id}'
  // #swagger.tags = ["Farmers"]
  // #swagger.summary = "Delete a farmer"
  // #swagger.description = "Deletes a farmer"
  // #swagger.parameters['id'] = { description: "Farmer ID", required: true, type: "string" }
  // #swagger.responses[200] = {description: "Farmer successfully deleted", content: {"application/json": {schema:{type:"object",properties:{message:{type:"string", example:"Successfully deleted"}}}, examples: {"Success": {value: {message: "Successfully deleted"}}}}}}
  // #swagger.responses[404] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Object not found": {value: {message: "Object with id '677164acd5343f0dac83716a' does not exist"}}}}}}
  // #swagger.responses[400] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Invalid ID format": {value: {message: "Id is incorrect"}}}}}}
  // #swagger.responses[500] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {example1: {$ref: '#/components/examples/error500'}}}}}

  console.log(`DELETE /farmers/${req.params.id} endpoint was called`);
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
  // #swagger.path = '/farmers/login'
  // #swagger.tags = ["Farmers"]
  // #swagger.summary = "Login a farmer"
  // #swagger.description = "Authenticates a farmer and returns a JWT token and farmer details"
  /* #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { type: "object", properties: { email: { type: "string" }, password: { type: "string" } } },
          examples: {
            example1: {
              summary: "A sample farmer login",
              value: {
                email: "john.doe@example.com",
                password: "password123"
              }
            }
          }
        }
      }
     } */
  // #swagger.responses[200] = {description: "Farmer logged in successfully", content: {"application/json": {schema:{type:"object",properties:{token:{type:"string", example:"your-jwt-token"},farmer:{$ref:"#/components/schemas/farmer"}}}, examples: {example1: {$ref: '#/components/examples/loginFarmerResponse'}}}}}
  // #swagger.responses[422] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Missing required properties": {value: {message: "All required properties must be defined"}}}}}}
  // #swagger.responses[401] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Invalid credentials": {value: {message: "Invalid email or password"}}}}}}
  // #swagger.responses[500] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {example1: {$ref: '#/components/examples/error500'}}}}}

  console.log(`POST /farmers/login endpoint was called`);
  const { email, password: inputPassword } = req.body;
  
  if (!email || !inputPassword)
    return res.status(422).json({ message: "All required properties must be defined" });

  try {
    const farmerDoc = await getDb().collection(collection).findOne({ email });
    if(!farmerDoc)
      return res.status(401).json({ message: "Invalid email or password" });

    const farmer: FarmerWithId = {
      _id: farmerDoc._id.toString(),
      email: farmerDoc.email,
      password: farmerDoc.password,
      farmName: farmerDoc.farmName,
      description: farmerDoc.description,
      name: farmerDoc.name,
      surname: farmerDoc.surname,
      location: {
        place: farmerDoc.location.place,
        postCode: farmerDoc.location.postCode,
        country: farmerDoc.location.country
      }
    }

    const isPasswordValid = await bcrypt.compare(inputPassword, farmer.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = generateFarmerToken(farmer)
    const { password, ...farmerWithoutPassword } = farmer;
    return res.status(200).json({ token: token, farmer: farmerWithoutPassword });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
