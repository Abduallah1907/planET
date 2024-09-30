import { Container } from 'typedi';
import nodemailer from 'nodemailer';
import LoggerInstance from './logger';
import agendaFactory from './agenda';
import config from '@/config';
import { UserController } from '@/api/controllers/userController';
import UserService from '@/services/userService';

export default ({ mongoConnection,models,services,controllers}: { mongoConnection: any; models: { name: string; model: any }[] ;services:{ name: string; service: any }[];controllers:{ name: string; controller: any }[]}) => {
  try {
    models.forEach(m => {
      Container.set(m.name, m.model);
    });
    services.forEach(s => {
      Container.set(s.name, s.service);
    });
    controllers.forEach(c => {
      Container.set(c.name, c.controller);
    });

    Container.set("userController",UserController);
    Container.set("userService",UserService);
    // Container.set("userService",UserService);
    const agendaInstance = agendaFactory({ mongoConnection });
    const transporter = nodemailer.createTransport({
        service: config.emails.host,
        auth: {
            user: config.emails.user,
            pass: config.emails.pass,
            clientId: config.emails.clientID,
            clientSecret: config.emails.clientSecret,
            refreshToken: config.emails.refershToken
        }
    });

    Container.set('agendaInstance', agendaInstance);
    Container.set('logger', LoggerInstance);
    Container.set('emailTransporter', transporter);

    LoggerInstance.info('✌️ Agenda injected into container');

    return { agenda: agendaInstance };
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};