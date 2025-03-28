import express from "express";
import farmersRouter from './routes/farmers';
import restaurantsRouter from './routes/restaurants';
import usersRouter from './routes/users';
import tokensRouter from './routes/tokens';
import { closeDatabaseConnection, connectToDatabase } from "./modules/database";
import { Server } from "http";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swaggerOutput.json";
import dotenv from 'dotenv';
import cors from "cors";

dotenv.config();

async function onServerStop(server: Server) {
  console.log('Closing database connection...');
  server.close(async () => {
    await closeDatabaseConnection();
    process.exit(0);
  });
}

export async function startServer() {
  try {
    const app = express();
    const baseUrl = process.env.UMS_BASE_URL;

    if (process.env.NODE_ENV !== 'test') {
      console.log("Connecting to database...");
      await connectToDatabase();
    }
    
    app.use(cors({
      origin: process.env.UMS_CORS_ALLOW_URL,
      credentials: true,
    }));
    app.use(express.json());
    app.use('/farmers', farmersRouter);
    app.use('/restaurants', restaurantsRouter);
    app.use('/tokens', tokensRouter);
    app.use('/admin', usersRouter);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));


    let server: Server;
    if (process.env.NODE_ENV !== 'test') {
      server = app.listen(3001, () => {
        console.log(`Server documentation on ${baseUrl}/api-docs`);
      });

      // Handle graceful shutdown
      process.on('SIGINT', () => onServerStop(server));
      process.on('SIGTERM', () => onServerStop(server));
      process.on('SIGQUIT', () => onServerStop(server));
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
