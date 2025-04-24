import { Request, Response, Router } from "express";
import { manageUsersBaseUrl } from "../../modules/config";
import { JwtUserRole } from "../../modules/interfaces/jwtPayload";
import { authorizeRoles } from "../../modules/middleware/authorizationJWT";

const router = Router();

const usersBaseUrl = `${manageUsersBaseUrl}`;


router.get('/allUsers', authorizeRoles([JwtUserRole.ADMIN, JwtUserRole.FARMER, JwtUserRole.RESTAURANT]), async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/grouped/allUsers'
  // #swagger.tags = ["Grouped"]
  // #swagger.responses[200] = { description: "Successful response"}
  // #swagger.responses[503]
  
  console.log(`GET /grouped endpoint was called`);
  try {
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
    
    if(!farmerResponse.ok || !restaurantResponse.ok)
        return res.status(503).json({ message: "Could not get data from other services" });

    const farmerJson = await farmerResponse.json();
    const restaurantJson = await restaurantResponse.json();
    return res.status(200).json({farmers: farmerJson, restaurants: restaurantJson});
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
