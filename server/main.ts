
import * as express from 'express';
import { Db } from './data-access/config';
import { Api } from './routes/base/Api';
import chalk from 'chalk';

require('dotenv-flow').config({
  node_env: process.env.NODE_ENV || 'development'
});

export const app: express.Express = express();

export let server: any;

export let db: Db;

function listen(): Promise<any> {
  // Initialize all API routes.
  Api.initialize(app);
  // Get environment variables.
  const port = process.env.PORT;
  return new Promise((resolve, reject) => {
    const server = app.listen(port, err => {
      if (err) {
        reject(err);
      }
      console.log(`Server running on port ${chalk.magentaBright(`${port}`)}`);
      resolve(server);
    });
  });
}

/**
 * Function to initialize application.
 *
 * @export function 
 * @returns an array containing the database connection
 * and the express application server.
 */
export async function init() {
  // Create database connection object.
  db = new Db();
  // Connect to the mongodb database server.
  const dbConnection = await db.connect();
  // Wait for the server to start listening
  server = await listen();
  return [dbConnection, server];
}

/**
 * Funciton to close the express application shutting
 * down the connection and closing the express application.
 * 
 * @exports funciton A function to close the application.
 * @return void
 */
export async function close() {
  // Disconnect from the mongodb database server.
  await db.disconnect();
  // Close express application.
  await server.close();
}
