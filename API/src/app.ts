import express from "express";
import config from "@/config";
import Logger from "@/loaders/logger";
import "reflect-metadata";
import { SocketIOLoader } from "@/loaders/socket";
import Container from "typedi";

async function startServer() {
  const app = express();

  /**
   * A little hack here
   * Import/Export can only be used in 'top-level code'
   * Well, at least in node 10 without babel and at the time of writing
   * So we are using good old require.
   **/
  await require("./loaders").default({ expressApp: app });

  const server = app
    .listen(config.port, () => {
      Logger.info(`
          ################################################
          🛡️  Server listening on port: ${config.port} 🛡️
          ################################################
        `);
    })
    .on("error", (err) => {
      Logger.error(err);
      process.exit(1);
    });

  // Get the SocketIOLoader instance from the typedi container
  const socketIOLoader = Container.get(SocketIOLoader);

  // Initialize the Socket.IO server
  socketIOLoader.initialize(server);
}

startServer();
