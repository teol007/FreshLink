import { Request, Response, Router } from "express";
import { authorizeRoles } from "../../modules/middleware/authorizationJWT";
import { JwtUserRole } from "../../modules/interfaces/jwtPayload";
import { manageUsersBaseUrl } from "../../modules/config";

const router = Router();

const farmersUrl = `${manageUsersBaseUrl}/farmers`;


router.get('/', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.FARMER, JwtUserRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/farmers/'
  // #swagger.tags = ["Farmers"]
  // #swagger.summary = "Get all farmers"
  // #swagger.description = "Returns a list of all farmers"
  // #swagger.responses[200] = {description: "Successful response with a list of farmers", content: {"application/json": {schema: {type: "array", items: {$ref: '#/components/schemas/farmer'}}, examples: {example1: {$ref: '#/components/examples/arrayOfFarmers'}}}}}
  // #swagger.responses[500] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {example1: {$ref: '#/components/examples/error500'}}}}}
  
  console.log(`GET /farmers endpoint was called`);
  try {
    const response = await fetch(farmersUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization ?? ""
      }
    });

    const json = await response.json();
    return res.status(response.status).json(json);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get('/:id', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.FARMER, JwtUserRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
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
    const response = await fetch(farmersUrl+"/"+req.params.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization ?? ""
      }
    });

    const json = await response.json();
    return res.status(response.status).json(json);
  } catch (error) {
    console.error("Error:", error);
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
    const response = await fetch(farmersUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization ?? ""
      },
      body: JSON.stringify(req.body)
    });

    const json = await response.json();
    return res.status(response.status).json(json);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


router.put('/:id', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.FARMER]), async (req: Request, res: Response): Promise<any> => {
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
    const response = await fetch(farmersUrl+"/"+req.params.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization ?? ""
      },
      body: JSON.stringify(req.body)
    });

    const json = await response.json();
    return res.status(response.status).json(json);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


router.delete('/:id', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.FARMER]), async (req: Request, res: Response): Promise<any> => {
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
    const response = await fetch(farmersUrl+"/"+req.params.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization ?? ""
      }
    });

    const json = await response.json();
    return res.status(response.status).json(json);
  } catch (error) {
    console.error("Error:", error);
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
  try {
    const response = await fetch(farmersUrl+"/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body)
    });

    const json = await response.json();
    return res.status(response.status).json(json);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
