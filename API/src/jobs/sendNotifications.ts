import { Container } from 'typedi';
import MailerService from '@/services/mailer';
import { Logger } from 'winston';
import { Job } from 'agenda';
import { NotificationService } from '@/services/notificationService';
import TouristService from '@/services/touristService';

export default class sendNotificationJob {
    public async sendAppNotifications(job: Job, done: (err?: any) => void): Promise<void> {
        const Logger: Logger = Container.get('logger');
        const notificationServiceInstance = Container.get(NotificationService);
        const touristServiceInstance: TouristService = Container.get(TouristService);
        try {
            Logger.debug('✌️ Send Notifications Job triggered!');
            const tickets = await touristServiceInstance.getTicketsInTheNext24hours();
            for (const ticket of tickets) {
                const booking: any = ticket.booking_id;
                const message = `You have a ticket for ${booking.name} in the next 24 hours`;
                notificationServiceInstance.sendNotification(ticket.tourist_id.toString(), message);
            }
            done();
        } catch (e) {
            Logger.error('🔥 Error with Email Sequence Job: %o', e);
            done(e);
        }
    }
}