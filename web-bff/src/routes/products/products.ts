import { Request, Response, Router } from "express";
import { authorizeRoles } from "../../modules/middleware/authorizationJWT";
import { JwtUserRole } from "../../modules/interfaces/jwtPayload";
import { productsClient } from "../../modules/clients/productsOfferingService/productsOfferingGrpc";
import * as grpc from '@grpc/grpc-js';
import { manageUsersBaseUrl } from "../../modules/config";

const router = Router();

router.get('/', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.FARMER, JwtUserRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/products/'
  // #swagger.tags = ["Products"]
  // #swagger.responses[200] = { description: "Successful response"}

  console.log(`GET /products endpoint was called`);
  try {
    const products = await new Promise<any[]>((resolve, reject) => {
      productsClient.getAllProducts({}, (err: any, response: any) => {
        if (err) return reject(err);
        resolve(response.products);
      });
    });

    res.status(200).json(products);
  } catch (err) {
    console.error('gRPC Error:', err);
    res.status(500).json({ message: 'gRPC request failed' });
  }
});

router.get('/allInfo', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.FARMER, JwtUserRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/products/allInfo'
  // #swagger.tags = ["Products"]
  // #swagger.responses[200] = { description: "Successful response"}
  // #swagger.responses[503]

  console.log(`GET /products/allInfo endpoint was called`);
  try {
    const usersBaseUrl = `${manageUsersBaseUrl}`;
    const farmerResponse = await fetch(usersBaseUrl+"/farmers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization ?? ""
      }
    });

    let productsFromResponse;
    try {
      productsFromResponse = await new Promise<any[]>((resolve, reject) => {
        productsClient.getAllProducts({}, (err: any, response: any) => {
          if (err) return reject(err);
          resolve(response.products);
        });
      });
    } catch (error) {
      return res.status(503).json({ message: "Could not get data from other service!" });
    }
    
    if(!farmerResponse.ok || !productsFromResponse)
        return res.status(503).json({ message: "Could not get data from other services." });

    const farmersJson = await farmerResponse.json();

    const productsWithMoreInfo = (productsFromResponse as any[]).map(product => {
      const farmer = (farmersJson as any[]).find(farmer => (farmer._id == product.farmerId));

      return {...product, farmer: farmer}
    });

    return res.status(200).json(productsWithMoreInfo);
  } catch (err) {
    console.error('gRPC Error:', err);
    res.status(500).json({ message: 'gRPC request failed' });
  }
});


router.get('/:id', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.FARMER, JwtUserRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/products/{id}'
  // #swagger.tags = ["Products"]
  // #swagger.parameters['id'] = { description: "Product ID", required: true, type: "string" }
  // #swagger.responses[200] = { description: "Successful response"}
  // #swagger.responses[404]

  console.log(`GET /products/${req.params.id} endpoint was called`);
  try {
    const product = await new Promise<any>((resolve, reject) => {
      productsClient.getProduct({ id: req.params.id }, (err: any, response: any) => {
        if (err) {
          if (err.code === grpc.status.NOT_FOUND) {
            console.error(err.details);
            return reject({
              status: 404,
              message: err.details
            });
          }
          
          return reject({
            status: 500,
            message: err.details || 'Unknown gRPC error'
          });
        }
        resolve(response);
      });
    });
  
    res.status(200).json(product);
  } catch (err) {
    const typedErr = err as { status: number; message: string };
    console.error('gRPC Error:', typedErr);
    res.status(typedErr.status || 500).json({ message: typedErr.message });
  }
});

router.post('/', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.FARMER, JwtUserRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/products/'
  // #swagger.tags = ["Products"]
  /* #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          example: {
            "id": "abc123",
            "name": "Organic Carrots",
            "description": "Fresh organic carrots harvested this week.",
            "price": 2.99,
            "quantity": 10,
            "unit": "kg",
            "category": "vegetables",
            "farmerId": "123456789",
            "farmerName": "Green Valley Farm"
          }
        }
      }
    } */
  // #swagger.responses[200] = { description: "Successful response"}
  // #swagger.responses[409]

  console.log(`POST /products endpoint was called`);
  try {
    const body = req.body;
    const product = await new Promise<any>((resolve, reject) => {
      productsClient.addProduct({ ...body }, (err: any, response: any) => {
        if (err) {
          if (err.code === grpc.status.ALREADY_EXISTS) {
            console.error(err.details);
            return reject({
              status: 409,
              message: err.details
            });
          }
          
          return reject({
            status: 500,
            message: err.details || 'Unknown gRPC error'
          });
        }
        resolve(response);
      });
    });
  
    res.status(200).json(product);
  } catch (err) {
    const typedErr = err as { status: number; message: string };
    console.error('gRPC Error:', typedErr);
    res.status(typedErr.status || 500).json({ message: typedErr.message });
  }
});

router.put('/:id', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.FARMER]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/products/{id}'
  // #swagger.tags = ["Products"]
  // #swagger.parameters['id'] = { description: "Product ID", required: true, type: "string" }
  /* #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          example: {
            "id": "abc123",
            "name": "Organic Carrots",
            "description": "Fresh organic carrots harvested this week.",
            "price": 2.99,
            "quantity": 10,
            "unit": "kg",
            "category": "vegetables",
            "farmerId": "123456789",
            "farmerName": "Green Valley Farm"
          }
        }
      }
    } */
  // #swagger.responses[200] = { description: "Successful response"}
  // #swagger.responses[404]

  console.log(`PUT /products/${req.params.id} endpoint was called`);
  try {
    const body = req.body;
    const product = await new Promise<any>((resolve, reject) => {
      productsClient.updateProduct({ ...body, id: req.params.id}, (err: any, response: any) => {
        if (err) {
          if (err.code === grpc.status.NOT_FOUND) {
            console.error(err.details);
            return reject({
              status: 404,
              message: err.details
            });
          }
          
          return reject({
            status: 500,
            message: err.details || 'Unknown gRPC error'
          });
        }
        resolve(response);
      });
    });
  
    res.status(200).json(product);
  } catch (err) {
    const typedErr = err as { status: number; message: string };
    console.error('gRPC Error:', typedErr);
    res.status(typedErr.status || 500).json({ message: typedErr.message });
  }
});

router.delete('/:id', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.FARMER, JwtUserRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/products/{id}'
  // #swagger.tags = ["Products"]
  // #swagger.parameters['id'] = { description: "Product ID", required: true, type: "string" }
  // #swagger.responses[200] = { description: "Successful response"}
  // #swagger.responses[404]

  console.log(`DELETE /products/${req.params.id} endpoint was called`);
  try {
    const product = await new Promise<any>((resolve, reject) => {
      productsClient.deleteProduct({ id: req.params.id }, (err: any, response: any) => {
        if (err) {
          if (err.code === grpc.status.NOT_FOUND) {
            console.error(err.details);
            return reject({
              status: 404,
              message: err.details
            });
          }
          
          return reject({
            status: 500,
            message: err.details || 'Unknown gRPC error'
          });
        }
        resolve(response);
      });
    });
  
    res.status(200).json({message: "Successfully deleted"});
  } catch (err) {
    const typedErr = err as { status: number; message: string };
    console.error('gRPC Error:', typedErr);
    res.status(typedErr.status || 500).json({ message: typedErr.message });
  }
});


export default router;
