import express from "express";
import farmersRouter from './routes/users/farmers';
import restaurantsRouter from './routes/users/restaurants';
import productsRouter from './routes/products/products';
import ordersRouter from './routes/orders/orders';
import groupedRouter from './routes/grouped/grouped';
import { Server } from "http";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swaggerOutput.json";
import dotenv from 'dotenv';
import cors from "cors";
import { baseUrl } from "./modules/config";
import { connectOrderProductsServiceMQ } from "./modules/clients/orderProductsService/orderProductsRabbitMQ";

dotenv.config();


export async function startServer() {
  try {
    await connectOrderProductsServiceMQ();
    console.log("Connected to 'Order Products Service' message queue.")

    const app = express();
    const baseUrlText = baseUrl;
    const baseServiceUrl = new URL(baseUrlText ?? "http://localhost:3002");
    
    app.use(cors({
      origin: process.env.WBFF_CORS_ALLOW_URL,
      credentials: true,
    }));
    app.use(express.json());
    app.use('/farmers', farmersRouter);
    app.use('/restaurants', restaurantsRouter);
    app.use('/products', productsRouter);
    app.use('/orders', ordersRouter);
    app.use('/grouped', groupedRouter);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));


    let server: Server;
    if (process.env.NODE_ENV !== 'test') {
      server = app.listen(baseServiceUrl.port, () => {
        console.log(`Server documentation on ${baseServiceUrl.origin}/api-docs`);
      });

    } else {
      // In test mode, create the server but don't listen on a port
      server = app.listen(0, () => {
        console.log("In-memory server created for testing");
      });
    }

    return server;
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

if (process.env.NODE_ENV !== 'test')
  startServer();
