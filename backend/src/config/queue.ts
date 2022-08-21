import { redis } from './redis';
import { QueueNames } from '../modules/queue/queue-names.enum';

export const queue = {
    queueNames: process.env.QUEUE_NAMES || QueueNames.Default.toString(),
    defaultQueueName: process.env.DEFAULT_QUEUE_NAME || QueueNames.Default.toString(),
    queueWorkers: () => {
        if (queue.enabled()) {
            return parseInt(process.env.QUEUE_WORKERS || '1', 10);
        }
        return 0;
    },
    enabled: () => {
        return process.env.QUEUE_ENABLED === '1';
    },
    queueNamesArray: () => queue.queueNames.split(','),
    host: process.env.NODE_QUEUE_HOST || process.env.QUEUE_HOST || redis.host,
    port: parseInt('6379', 10),
    password: process.env.NODE_QUEUE_PASSWORD || null,
    initialisationDelay: parseInt(process.env.NODE_QUEUE_INIT_DELAY || (1000 * 30).toString(), 10),
    oldJobQualifyTime: parseInt(process.env.OLD_JOB_QUALIFY_TIME || (7).toString(), 10), // Number of days for a job to be queued before it is cancelled
    promiseTimeoutMs: Number(process.env.QUEUE_PROMISE_TIMEOUT_MS || 120000), // 2 minutes
};
