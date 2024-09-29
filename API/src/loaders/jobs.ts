import config from '@/config';
import EmailSequenceJob from '@/jobs/emailSequence';
import Agenda, { JobPriority, Job } from 'agenda';

export default ({ agenda }: { agenda: Agenda }) => {
  agenda.define(
    'send-email', 
    //{ priority: JobPriority.high, concurrency: config.agenda.concurrency },
    async (job: Job, done: (err?: any) => void) => {
        await new EmailSequenceJob().handler(job, done);
    }
  );

  agenda.start();
};