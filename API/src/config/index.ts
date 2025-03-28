import dotenv from "dotenv";
import e from "express";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT || "8000", 10),

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI,

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET,
  jwtAlgorithm: process.env.JWT_ALGORITHM,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },

  /**
   * Agenda.js stuff
   */
  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY || "10", 10),
  },

  /**
   * Agendash config
   */
  agendash: {
    user: "agendash",
    password: "123456",
  },
  /**
   * API configs
   */
  api: {
    prefix: "/api",
  },

  /**
   * NodeMailer Config
   */
  emails: {
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientID: process.env.OAUTH_MAIL_CLIENTID,
    clientSecret: process.env.OAUTH_MAIL_CLIENT_SECRET,
    refershToken: process.env.OAUTH_MAIL_REFRESH_TOKEN,
  },

  /**
   * Amadeus API Config
   */
  amadeus: {
    clientID: process.env.AMADEUS_CLIENTID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET
  },

  env: process.env.NODE_ENV || "development",
};
