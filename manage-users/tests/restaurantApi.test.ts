import request from 'supertest';
import { startServer } from '../src';
import { app } from './setup';

let token: string;
let createdRestaurantId: string;

describe('Restaurants API', () => {
  let restaurantData = {
    email: 'restaurant@example.com',
    password: 'password123',
    name: 'Best Restaurant',
    description: 'Serving the best food in town.',
    location: {
      place: 'New York',
      postCode: '10001',
      country: 'USA',
    },
    phoneNumber: '1234567890',
    rating: 4.5,
  };

  it('should create a new restaurant', async () => {
    const response = await request(app)
      .post('/restaurants')
      .send(restaurantData)
      .expect(200);

    expect(response.body.email).toBe(restaurantData.email);
    expect(response.body.name).toBe(restaurantData.name);
    expect(response.body.location.place).toBe(restaurantData.location.place);

    createdRestaurantId = response.body._id;
  });

  it('should log in the restaurant and get a JWT token', async () => {
    const loginResponse = await request(app)
      .post('/restaurants/login')
      .send({
        email: restaurantData.email,
        password: restaurantData.password,
      })
      .expect(200);

    expect(loginResponse.body.token).toBeDefined();
    token = loginResponse.body.token;
  });

  it('should get all restaurants with valid JWT token', async () => {
    const response = await request(app)
      .get('/restaurants')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const { password, ...expected } = { _id: createdRestaurantId, ...restaurantData };
    expect(response.body).toStrictEqual([expected]);
  });

  it('should get a specific restaurant by ID with valid JWT token', async () => {
    const response = await request(app)
      .get(`/restaurants/${createdRestaurantId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const { password, ...expected } = { _id: createdRestaurantId, ...restaurantData };
    expect(response.body).toStrictEqual(expected);
  });

  it('should update the restaurant details with valid JWT token', async () => {
    const updatedRestaurantData = {
      email: 'restaurant@example.com',
      name: 'Best Organic Restaurant',
      description: 'Serving organic food with love.',
      location: {
        place: 'Los Angeles',
        postCode: '90001',
        country: 'USA',
      },
      phoneNumber: '0987654321',
      rating: 5.0,
    };

    const response = await request(app)
      .put(`/restaurants/${createdRestaurantId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedRestaurantData)
      .expect(200);

    expect(response.body.name).toBe(updatedRestaurantData.name);
    expect(response.body.description).toBe(updatedRestaurantData.description);
    expect(response.body.location.place).toBe(updatedRestaurantData.location.place);
  });

  it('should delete the restaurant with valid JWT token', async () => {
    const response = await request(app)
      .delete(`/restaurants/${createdRestaurantId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.message).toBe("Successfully deleted");
  });
});
