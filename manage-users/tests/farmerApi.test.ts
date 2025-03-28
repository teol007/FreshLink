import request from 'supertest';
import { app } from './setup';

let token: string;
let createdFarmerId: string;

describe('Farmers API', () => {
  let farmerData = {
    email: 'john.doe@example.com',
    password: 'password123',
    farmName: 'Doe Farms',
    description: 'Best farm in town.',
    name: 'John',
    surname: 'Doe',
    location: {
      place: 'New York',
      postCode: '10001',
      country: 'USA',
    },
  };

  it('should create a new farmer', async () => {
    const response = await request(app)
      .post('/farmers')
      .send(farmerData)
      .expect(200);

    expect(response.body.email).toBe(farmerData.email);
    expect(response.body.farmName).toBe(farmerData.farmName);
    expect(response.body.name).toBe(farmerData.name);

    createdFarmerId = response.body._id;
  });

  it('should log in the farmer and get a JWT token', async () => {
    const loginResponse = await request(app)
      .post('/farmers/login')
      .send({
        email: farmerData.email,
        password: farmerData.password,
      })
      .expect(200);

    expect(loginResponse.body.token).toBeDefined();
    token = loginResponse.body.token;
  });

  it('should get all farmers with valid JWT token', async () => {
    const response = await request(app)
      .get('/farmers')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const {password, ...expected} = {_id: createdFarmerId, ...farmerData};
    expect(response.body).toStrictEqual([expected]);
  });

  it('should get a specific farmer by ID with valid JWT token', async () => {
    const response = await request(app)
      .get(`/farmers/${createdFarmerId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const {password, ...expected} = {_id: createdFarmerId, ...farmerData};
    expect(response.body).toStrictEqual(expected);
  });

  it('should update the farmer details with valid JWT token', async () => {
    const updatedFarmerData = {
      email: "john.doe@example.com",
      farmName: 'Doe Organic Farms',
      description: 'The best organic farm in town.',
      name: 'John',
      surname: 'Doe',
      location: {
        place: 'New York',
        postCode: '10001',
        country: 'USA',
      },
    };

    const response = await request(app)
      .put(`/farmers/${createdFarmerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedFarmerData)
      .expect(200);

    expect(response.body.farmName).toBe(updatedFarmerData.farmName);
    expect(response.body.description).toBe(updatedFarmerData.description);
  });

  it('should delete the farmer with valid JWT token', async () => {
    const response = await request(app)
      .delete(`/farmers/${createdFarmerId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.message).toBe("Successfully deleted");
  });
});
