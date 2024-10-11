import { Container } from "typedi";
import nodemailer from "nodemailer";
import LoggerInstance from "./logger";
import agendaFactory from "./agenda";
import config from "@/config";
import { gridfsLoader } from "./gridfs";
import mongoose from "mongoose";

export default ({
  mongoConnection,
  models,
  gfs,
  upload,
}: {
  mongoConnection: mongoose.Connection;
  models: { name: string; model: any }[];
  gfs: any;
  upload: any;
}) => {
  try {
    models.forEach((m) => {
      Container.set(m.name, m.model);
    });

    const agendaInstance = agendaFactory({ mongoConnection });
    const transporter = nodemailer.createTransport({
      service: config.emails.service,
      auth: {
        user: config.emails.user,
        pass: config.emails.pass,
        // clientId: config.emails.clientID,
        // clientSecret: config.emails.clientSecret,
        // refreshToken: config.emails.refershToken
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    Container.set("agendaInstance", agendaInstance);
    Container.set("logger", LoggerInstance);
    Container.set("emailTransporter", transporter);
    Container.set("gridfsInstance", gfs);
    Container.set("uploadInstance", upload);
    LoggerInstance.info("✌️ Agenda injected into container");

    return { agenda: agendaInstance };
  } catch (e) {
    LoggerInstance.error("🔥 Error on dependency injector loader: %o", e);
    throw e;
  }
};
