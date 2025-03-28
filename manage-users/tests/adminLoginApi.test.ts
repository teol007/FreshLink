import request from "supertest";
import { getDb } from "../src/modules/database";
import { JwtPayloadRole } from "../src/modules/interfaces/jwtPayload";
import { app } from "./setup";

const adminEmail = "admin@example.com";
const adminPassword = "strong-password";

describe("Admin Login API", () => {
  beforeAll(async () => {
    const db = getDb();
    const collection = db.collection("users");

    await collection.deleteMany({ email: adminEmail });

    await collection.insertOne({
      email: adminEmail,
      password: adminPassword,
      name: "Admin",
      surname: "User",
      role: JwtPayloadRole.ADMIN,
      location: { city: "Admin City", country: "Admin Country" },
    });
  });

  afterAll(async () => {
    const db = getDb();
    const collection = db.collection("users");
    await collection.deleteMany({ email: adminEmail });
  });

  it("should successfully log in with valid credentials", async () => {
    const response = await request(app)
      .post("/admin/login")
      .send({
        email: adminEmail,
        password: adminPassword,
      })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.token).toBeDefined();
    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: adminEmail,
        role: "admin",
        name: "Admin",
        surname: "User",
        location: { city: "Admin City", country: "Admin Country" },
      })
    );
  });

  it("should return 401 for invalid credentials", async () => {
    const response = await request(app)
      .post("/admin/login")
      .send({
        email: adminEmail,
        password: "wrong-password",
      })
      .expect(401);

    expect(response.body.message).toBe("Invalid email or password");
  });

  it("should return 401 for non-existing user", async () => {
    const response = await request(app)
      .post("/admin/login")
      .send({
        email: "nonexistent@example.com",
        password: adminPassword,
      })
      .expect(401);

    expect(response.body.message).toBe("Invalid email or password");
  });
});
