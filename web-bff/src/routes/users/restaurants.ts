import { Request, Response, Router } from "express";
import { authorizeRoles } from "../../modules/middleware/authorizationJWT";
import { JwtUserRole } from "../../modules/interfaces/jwtPayload";
import { manageUsersBaseUrl } from "../../modules/config";

const router = Router();

const restaurantsUrl = `${manageUsersBaseUrl}/restaurants`;

router.get('/', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.RESTAURANT, JwtUserRole.FARMER]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/restaurants/'
  // #swagger.tags = ["Restaurants"]
  // #swagger.summary = "Get all restaurants"
  // #swagger.description = "Returns a list of all restaurants"
  // #swagger.responses[200] = {description: "Successful response with a list of restaurants", content: {"application/json": {schema: {type: "array", items: {$ref: '#/components/schemas/restaurant'}}, examples: {example1: {$ref: '#/components/examples/arrayOfRestaurants'}}}}}
  // #swagger.responses[500] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {example1: {$ref: '#/components/examples/error500'}}}}}
    
  console.log(`GET /restaurants endpoint was called`);
  try {
    const response = await fetch(restaurantsUrl, {
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


router.get('/:id', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
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
    const response = await fetch(restaurantsUrl+"/"+req.params.id, {
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
    const response = await fetch(restaurantsUrl, {
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


router.put('/:id', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
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
    const response = await fetch(restaurantsUrl+"/"+req.params.id, {
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


router.delete('/:id', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
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
    const response = await fetch(restaurantsUrl+"/"+req.params.id, {
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
  try {
    const response = await fetch(restaurantsUrl+"/login", {
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
