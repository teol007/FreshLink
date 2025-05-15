import { Request, Response, Router } from "express";
import { authorizeRoles } from "../../modules/middleware/authorizationJWT";
import { JwtUserRole } from "../../modules/interfaces/jwtPayload";
import { manageUsersBaseUrl, orderProductsRestBaseUrl } from "../../modules/config";
import { publishToQueueAuditLogs, publishToQueueOrderProductsService } from "../../modules/clients/orderProductsService/orderProductsRabbitMQ";
import { productsClient } from "../../modules/clients/productsOfferingService/productsOfferingGrpc";

const router = Router();

const ordersRestUrl = `${orderProductsRestBaseUrl}/orders`;


router.get('/', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.FARMER, JwtUserRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/orders/'
  // #swagger.tags = ["Orders"]
  // #swagger.responses[200] = { description: "Successful response"}
  
  try {
    publishToQueueAuditLogs(`GET /orders endpoint was called from ip ${req.ip}`)
    const response = await fetch(ordersRestUrl, {
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

router.get('/allInfo', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.FARMER, JwtUserRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/orders/allInfo'
  // #swagger.tags = ["Orders"]
  // #swagger.responses[200] = { description: "Successful response"}
  // #swagger.responses[503]
  
  try {
    publishToQueueAuditLogs(`GET /orders/allInfo endpoint was called from ip ${req.ip}`)
    const usersBaseUrl = `${manageUsersBaseUrl}`;

    const ordersResponse = await fetch(ordersRestUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization ?? ""
      }
    });
    const farmerResponse = await fetch(usersBaseUrl+"/farmers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization ?? ""
      }
    });
    const restaurantResponse = await fetch(usersBaseUrl+"/restaurants", {
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
    
    
    if(!ordersResponse.ok || !farmerResponse.ok || !restaurantResponse.ok || !productsFromResponse)
        return res.status(503).json({ message: "Could not get data from other services." });
      
    const ordersJson = await ordersResponse.json();
    const farmersJson = await farmerResponse.json();
    const restaurantJson = await restaurantResponse.json();

    const ordersWithMoreInfo = (ordersJson as any[]).map(order => {
      const farmer = (farmersJson as any[]).find(farmer => (farmer._id == order.farmer_id));
      const restaurant = (restaurantJson as any[]).find(restaurant => (restaurant._id == order.restaurant_id));

      (order.products as any[]).forEach(orderProduct => {
        orderProduct.product = (productsFromResponse as any[]).find(pfr => (pfr.id == orderProduct.product_id));
      });
      return {...order, farmer: farmer, restaurant: restaurant}
    });

    return res.status(200).json(ordersWithMoreInfo);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get('/:id', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.FARMER, JwtUserRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/orders/{id}'
  // #swagger.tags = ["Orders"]
  // #swagger.parameters['id'] = { description: "Order ID", required: true, type: "string" }
  // #swagger.responses[200] = { description: "Successful response"}
  // #swagger.responses[404]
  
  try {
    publishToQueueAuditLogs(`GET /orders/${req.params.id} endpoint was called from ip ${req.ip}`)
    const response = await fetch(ordersRestUrl+"/"+req.params.id, {
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


router.post('/', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.FARMER, JwtUserRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/orders/'
  // #swagger.tags = ["Orders"]
  /* #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          example: {
            "_id": "67f9899c5be73585d33d44ae",
            "restaurant_id": "restaurant12345",
            "farmer_id": "farmer456",
            "products": [
              {
                "product_id": "apple00123",
                "quantity": 105.5
              },
              {
                "product_id": "banana002",
                "quantity": 7.2
              }
            ]
          }
        }
      }
    } */
  // #swagger.responses[200] = { description: "Successfully sent request for further processing"}
  
  try {
    publishToQueueAuditLogs("POST /orders endpoint was called from ip "+req.ip)
    publishToQueueOrderProductsService({action: "create", order: req.body})
    res.status(200).json({ message: 'Successfully sent request for further processing' });
  } catch (err) {
    console.error('Publish error:', err);
    res.status(500).json({ message: 'Failed to publish message' });
  }
});


router.put('/:id', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.FARMER]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/orders/{id}'
  // #swagger.tags = ["Orders"]
  // #swagger.parameters['id'] = { description: "Order ID", required: true, type: "string" }
  /* #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          example: {
            "_id": "67f9899c5be73585d33d44ae",
            "restaurant_id": "restaurant12345",
            "farmer_id": "farmer456",
            "products": [
              {
                "product_id": "apple00123",
                "quantity": 105.5
              },
              {
                "product_id": "banana002",
                "quantity": 7.2
              }
            ]
          }
        }
      }
    } */
  // #swagger.responses[200] = { description: "Successfully sent request for further processing"}
  
  try {
    publishToQueueAuditLogs(`PUT /orders/${req.params.id} endpoint was called from ip ${req.ip}`)
    req.body._id = req.params.id;
    publishToQueueOrderProductsService({action: "update", order: req.body})
    res.status(200).json({ message: 'Successfully sent request for further processing' });
  } catch (err) {
    console.error('Publish error:', err);
    res.status(500).json({ message: 'Failed to publish message' });
  }
});


router.delete('/:id', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.FARMER, JwtUserRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/orders/{id}'
  // #swagger.tags = ["Orders"]
  // #swagger.parameters['id'] = { description: "Order ID", required: true, type: "string" }
  // #swagger.responses[200] = { description: "Successfully sent request for further processing"}
  
  try {
    publishToQueueAuditLogs(`DELETE /orders/${req.params.id} endpoint was called from ip ${req.ip}`)
    publishToQueueOrderProductsService({action: "delete", order_id: req.params.id})
    res.status(200).json({ message: 'Successfully sent request for further processing' });
  } catch (err) {
    console.error('Publish error:', err);
    res.status(500).json({ message: 'Failed to publish message' });
  }
});

export default router;
