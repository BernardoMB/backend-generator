import * as Mongoose from 'mongoose';
import chalk from 'chalk';

export class Db {
  
  constructor() {
    (<any>Mongoose).Promise = global.Promise;
  }

  /**
   * Create mongodb databse connection.
   *
   * @returns {Promise<typeof Mongoose>}
   * @memberof Db
   */
  async connect(): Promise<typeof Mongoose> {
    try {
      let connection: typeof Mongoose;
      const db = process.env.DB;
      const connectionOptions = {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
      if (process.env.DB_AUTH) {
        connection = await Mongoose.connect(
          db,
          // WARNING: Database authentication not implemented
          { ...connectionOptions,/* user: 'newt', pass: 'mimaamakim' */ }
        );
      } else {
        connection = await Mongoose.connect(
          db,
          { ...connectionOptions }
        );
      }
      console.log(`Running on environment: ${chalk.magentaBright(process.env.NODE_ENV)}`);
      console.log(`Connected to db: ${chalk.magentaBright(db)}`);
      return connection;
    } catch (error) {
      console.error(`Error connecting to db: ${chalk.redBright(error)}`);
    }
  }

  /**
   * Disconnect from the mongodb database.
   *
   * @memberof Db
   */
  async disconnect() {
    try {
      const db = process.env.DB;
      console.log(`Disconnected from db: ${chalk.magentaBright(db)}`);
    } catch (error) {
      console.error(`Error disconnecting from db: ${chalk.redBright(error)}`);
    }
  }
}
