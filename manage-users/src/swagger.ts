import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv';
import { farmerExample, farmerSchema, farmerWithoutIdExample, farmerWithoutIdSchema, postFarmerSchema, postFarmerExample } from './docs/SwaggerFarmer';
import { locationSchema } from './docs/SwaggerLocation';
import { userExample, userSchema } from './docs/SwaggerUser';
import { error500Example, errorSchema } from './docs/SwaggerError';
import { postRestaurantExample, postRestaurantSchema, restaurantExample, restaurantSchema, restaurantWithoutIdExample, restaurantWithoutIdSchema } from './docs/SwaggerRestaurant';

dotenv.config();

const outputFile = './swaggerOutput.json';
const endpointsFiles = ['./routes/*.ts'];

const doc = {
  info: {
    version: 'v1.0.0',
    title: 'Manage users',
    description: 'FreshLink manage users service'
  },
  servers: [
    {
      url: process.env.UMS_BASE_URL,
      description: ''
    },
  ],
  security: [
    {bearerAuth: []},
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: "Get the token from login endpoints",
      }
    },
    schemas: {
      location: locationSchema,
      farmer: farmerSchema,
      restaurant: restaurantSchema,
      error: errorSchema
    },
    hiddenSchemas: {
      postFarmer: postFarmerSchema,
      farmerWithoutId: farmerWithoutIdSchema,
      postRestaurant: postRestaurantSchema,
      restaurantWithoutId: restaurantWithoutIdSchema,
      user: userSchema
    },
    examples: {
      postFarmer: {
        summary: "A sample input farmer object",
        value: postFarmerExample
      },
      farmer: {
        summary: "A sample farmer object",
        value: farmerExample
      },
      farmerWithoutId: {
        summary: "A sample farmer object",
        value: farmerWithoutIdExample
      },
      arrayOfFarmers: {
        summary: "A sample array of farmer objects",
        value: [farmerExample]
      },
      loginFarmerResponse: {
        summary: "A sample farmer login response",
        value: {token: "your-jwt-token", farmer: farmerExample}
      },
      authenticateFarmer: {
        summary: "Response with role and farmer object",
        value: {role: "farmer", object: farmerExample}
      },
      postRestaurant: {
        summary: "A sample input restaurant object",
        value: postRestaurantExample
      },
      restaurant: {
        summary: "A sample restaurant object",
        value: restaurantExample
      },
      restaurantWithoutId: {
        summary: "A sample restaurant object",
        value: restaurantWithoutIdExample
      },
      arrayOfRestaurants: {
        summary: "A sample array of restaurant objects",
        value: [restaurantExample]
      },
      loginRestaurantResponse: {
        summary: "A sample restaurant login response",
        value: {token: "your-jwt-token", restaurant: restaurantExample}
      },
      authenticateRestaurant: {
        summary: "Response with role and restaurant object",
        value: {role: "restaurant", object: restaurantExample}
      },
      loginUserResponse: {
        summary: "A sample login response",
        value: {token: "your-jwt-token", user: userExample}
      },
      authenticateUser: {
        summary: "Response with role and user object",
        value: {role: "admin", object: userExample}
      },
      error500: {
        summary: "Server error",
        value: error500Example
      },
    }
  }
};

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
