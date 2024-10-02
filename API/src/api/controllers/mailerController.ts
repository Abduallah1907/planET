import MailerService from '@/services/mailer';
import { Request, Response } from 'express';
import Container, { Service } from 'typedi';

@Service()
export class MailerController {
    public async sendWelcomeMail(req: Request, res: Response){
        const { to } = req.body;
        const mailerService: MailerService = Container.get(MailerService);
        await mailerService.SendWelcomeEmail(to);
        res.status(200).send({message:'Email sent successfully'});
    };
}

export default new MailerController();