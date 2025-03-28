import { startServer } from '../src';
import { closeDatabaseConnection, connectToDatabase } from '../src/modules/database';

export let app: any;

beforeAll(async () => {
  await connectToDatabase();
  app = await startServer(); // Start the server without binding to a port
});

afterAll(async () => {
  if (app) {
    app.close();
  }
  await closeDatabaseConnection();
});
