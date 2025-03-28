import { Request, Response, Router } from "express";
import { UserWithId } from "../modules/interfaces/users";
import { getDb } from "../modules/database";
import { generateUserToken } from "../modules/functions/jwt";

const router = Router();

const collection = "users";

router.post('/login', async (req: Request, res: Response): Promise<any> => {
  // #swagger.path = '/admin/login'
  // #swagger.tags = ["Admin"]
  // #swagger.summary = "Login admin"
  // #swagger.description = "Authenticates a admin and returns a JWT token and admin details"
  /* #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { type: "object", properties: { email: { type: "string" }, password: { type: "string" } } },
          examples: {
            example1: {
              summary: "A sample farmer login",
              value: {
                email: "admin@example.com",
                password: "strong-password"
              }
            }
          }
        }
      }
     } */
  // #swagger.responses[200] = { description: "Admin logged in successfully", content: {"application/json": {schema:{type:"object",properties:{token:{type:"string", example:"your-jwt-token"},user:{$ref:"#/components/hiddenSchemas/user"}}}, examples: {example1: {$ref: '#/components/examples/loginUserResponse'}}}}}
  // #swagger.responses[401] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {"Invalid credentials": {value: {message: "Invalid email or password"}}}}}}
  // #swagger.responses[500] = {content: {"application/json": {schema: {$ref: '#/components/schemas/error'}, examples: {example1: {$ref: '#/components/examples/error500'}}}}}
  
  console.log(`POST /admin/login endpoint was called`);
  const { email, password: inputPassword } = req.body;

  try {
    const userDoc = await getDb().collection(collection).findOne({ email });
    if(!userDoc)
      return res.status(401).json({ message: "Invalid email or password" });


    const user: UserWithId = {
      _id: userDoc._id.toString(),
      email: userDoc.email,
      password: userDoc.password,
      role: userDoc.role,
      name: userDoc.name,
      surname: userDoc.surname,
      location: userDoc.location
    }

    //const isPasswordValid = await bcrypt.compare(inputPassword, user.password);
    const isPasswordValid = user.password===inputPassword
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = generateUserToken(user)
    const { password, ...objectWithoutPassword } = user;
    return res.status(200).json({ token: token, user: objectWithoutPassword });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
