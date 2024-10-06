import mongoose from "mongoose";
import { Db } from "mongodb";
import config from "@/config";

export default async (): Promise<Db> => {
  const databaseURL: string | undefined = config.databaseURL;
  if (!databaseURL) {
    throw new Error("⚠️  Database URL not found in configuration  ⚠️");
  }

  // interface ConnectOptions extends mongodb.MongoClientOptions {
  //   /** Set to false to [disable buffering](http://mongoosejs.com/docs/faq.html#callback_never_executes) on all models associated with this connection. */
  //   bufferCommands?: boolean;
  //   /** The name of the database you want to use. If not provided, Mongoose uses the database name from connection string. */
  //   dbName?: string;
  //   /** username for authentication, equivalent to `options.auth.user`. Maintained for backwards compatibility. */
  //   user?: string;
  //   /** password for authentication, equivalent to `options.auth.password`. Maintained for backwards compatibility. */
  //   pass?: string;
  //   /** Set to false to disable automatic index creation for all models associated with this connection. */
  //   autoIndex?: boolean;
  //   /** Set to `true` to make Mongoose automatically call `createCollection()` on every model created on this connection. */
  //   autoCreate?: boolean;
  // }
  mongoose.set("strictQuery", false);
  const connection = await mongoose.connect(databaseURL.concat("planET"), {
    autoIndex: true,
    autoCreate: true,
  });
  return connection.connection.db;
};
