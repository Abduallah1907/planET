import config from '@/config';
import EmailSequenceJob from '@/jobs/emailSequence';
import sendNotificationJob from '@/jobs/sendNotifications';
import Agenda, { JobPriority, Job } from 'agenda';

export default async ({ agenda }: { agenda: Agenda }) => {
  agenda.define(
    'send-email', 
    //{ priority: JobPriority.high, concurrency: config.agenda.concurrency },
    async (job: Job, done: (err?: any) => void) => {
        await new EmailSequenceJob().handler(job, done);
    }
  );

  agenda.define(
    'send-notifictaion',
    async (job: Job, done: (err?: any) => void) => {
      await new sendNotificationJob().sendAppNotifications(job, done);
    }
  );

  await agenda.start();
  
  await agenda.every("1 minutes", "send-notification");
};