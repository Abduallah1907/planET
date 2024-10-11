import Agenda from "agenda";
import config from "@/config";

export default ({ mongoConnection }: { mongoConnection: any }) => {
  return new Agenda({
    mongo: mongoConnection.db,
    processEvery: config.agenda.pooltime,
    db: {
      address: config.databaseURL || "defaultDatabaseURL",
      collection: config.agenda.dbCollection,
    },
    maxConcurrency: config.agenda.concurrency,
  });
  /**
   * This voodoo magic is proper from agenda.js so I'm not gonna explain too much here.
   * https://github.com/agenda/agenda#mongomongoclientinstance
   */
};
