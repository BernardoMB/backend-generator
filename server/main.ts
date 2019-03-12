
  import * as express from 'express';
  import { Db } from './data-access/config';
  import { Api } from './routes/base/Api';
  import chalk from 'chalk';
  
  require('dotenv-flow').config({
    node_env: process.env.NODE_ENV || 'development'
  });
  
  export const app = express();
  
  function listen(): Promise<express.Express> {
    // Initialize all API routes.
    Api.initialize(app);
    // Get environment variables.
    const port = process.env.PORT;
    return new Promise((resolve, reject) => {
      app.listen(port, err => {
        if (err) {
          reject(err);
        }
        console.log(`Server running on port ${chalk.magentaBright(`${port}`)}`);
        resolve(app);
      });
    });
  }
  
  /**
   * Function to initialize application.
   *
   * @export
   * @returns
   */
  export async function init() {
    // Create database connection object.
    const db = new Db();
    // Connect to the mongodb database.
    const dbConnection = await db.connect();
    // Wait for the server to start listening
    const app = await listen();
    return [dbConnection, app];
  }
