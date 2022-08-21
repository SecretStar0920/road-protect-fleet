import { Config } from '@config/config';
import { JobStatus } from '@entities';
import { Logger } from '@logger';
import { JobService } from '@modules/job/services/job.service';
import { RealtimeGateway } from '@modules/shared/modules/realtime/gateways/realtime.gateway';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { JobOptions } from 'bull';
import * as Queue from 'bull';
import { DispatchJob } from '@modules/queue/services/dispatch-job.interface';
import { QueueableJob } from '@modules/queue/queueable.job';
import * as d from 'debug';
import { QueueException } from '@modules/queue/queue.exception';
import { QueueNames } from '@modules/queue/queue-names.enum';
import { v1 } from 'uuid';
import { forEach } from 'lodash';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { promiseTimeout } from '@modules/shared/helpers/promise-timeout';

const debug = d('fleet:queue');

@Injectable()
export class QueueService implements OnModuleDestroy {
    private static queues: { [queueName: string]: Queue.Queue };

    constructor(private readonly moduleRef: ModuleRef, private readonly logger: Logger, private jobLogService: JobService) {
        QueueService.queues = QueueService.queues || {};

        setTimeout(() => this.initialiseQueues(), Config.get.queue.initialisationDelay);
    }

    /**
     * Starts the queues based on the queue names specified in the environment
     */
    private initialiseQueues() {
        const fn = this.initialiseQueues.name;
        if (!Config.get.queue.enabled()) {
            QueueService.queues = {};
            debug(`Queues have been DISABLED for this pod`);
            this.logger.log({ message: `Queues have been DISABLED for this pod`, fn });
            return;
        }

        const queueNames = Config.get.queue.queueNamesArray();
        this.logger.log({ message: `Starting the queue service with the following queue names: `, fn, detail: queueNames });
        this.logger.log({ message: `The number of queue workers being used in this container is ${Config.get.queue.queueWorkers()}`, fn });
        queueNames.forEach((queueName) => {
            const queue = this.createQueue(queueName);

            // Although I'd like to typecast the dispatch job interface
            // in this case it doesn't make sense because I don't know
            // what the data is going to look like at this point.
            queue.process(queueName, Config.get.queue.queueWorkers(), async (job: Queue.Job<DispatchJob>) => {
                RealtimeGateway.server.emit('job', { uuid: job.data.uuid, status: JobStatus.InProgress });
                await this.jobLogService.upsertJobLog({
                    uuid: job.data.uuid,
                    jobType: job.data.type,
                    queueName,
                    data: job.data.data,
                    status: JobStatus.InProgress,
                    userId: job.data.userId,
                });
                const id = `Job ${job.id} -`;

                this.logger.debug({ message: `${id} Processing job of type ${job.data.type}`, fn });

                const processor: QueueableJob<any> = this.moduleRef.get(job.data.type, { strict: false });

                if (!processor) {
                    this.logger.error({ message: `Could not find the processor for the type ${job.data.type}`, fn });
                    throw new QueueException(
                        ERROR_CODES.E159_QueueMissingProcessorType.message({
                            processorType: job.data.type,
                        }),
                    );
                }

                const data = job.data.data;
                try {
                    debug(
                        `Running the job for id ${id} and type ${job.data.type} with a timeout of ${Config.get.queue.promiseTimeoutMs}ms`,
                        data,
                    );
                    this.logger.debug({
                        message: `Running the job for id ${id} and type ${job.data.type} with a timeout of ${Config.get.queue.promiseTimeoutMs}ms`,
                        detail: data,
                        fn,
                    });
                    const processed = await promiseTimeout(processor.run(data), Config.get.queue.promiseTimeoutMs).catch(async (error) => {
                        this.logger.error({
                            message: `${id} Processing job of type ${job.data.type} FAILED`,
                            detail: { error },
                            fn,
                        });
                        RealtimeGateway.server.emit('job', { uuid: job.data.uuid, status: JobStatus.Failed });
                        await this.jobLogService.upsertJobLog({
                            uuid: job.data.uuid,
                            jobType: job.data.type,
                            queueName,
                            data: job.data.data,
                            status: JobStatus.Failed,
                            userId: job.data.userId,
                            error,
                        });
                        throw error;
                    });

                    RealtimeGateway.server.emit('job', { uuid: job.data.uuid, status: JobStatus.Completed });
                    await this.jobLogService.upsertJobLog({
                        uuid: job.data.uuid,
                        jobType: job.data.type,
                        queueName,
                        data: job.data.data,
                        status: JobStatus.Completed,
                        userId: job.data.userId,
                    });
                    this.logger.debug({ message: `${id} Processing job of type ${job.data.type} COMPLETE`, fn });

                    return;
                } catch (e) {
                    RealtimeGateway.server.emit('job', { uuid: job.data.uuid, status: JobStatus.Failed });
                    await this.jobLogService.upsertJobLog({
                        uuid: job.data.uuid,
                        jobType: job.data.type,
                        queueName,
                        data: job.data.data,
                        status: JobStatus.Failed,
                        userId: job.data.userId,
                        error: e,
                    });
                    this.logger.error({
                        message: `${id} Processing job of type ${job.data.type} FAILED`,
                        fn,
                        detail: {
                            error: e.message,
                            stack: e.stack,
                        },
                    });

                    throw e;
                }
            });
        });
    }

    /**
     * Add a job to the queue, you need to specify the name of the class (the job),
     * the data that should be used during the run command, and the name of the queue
     * to add the job to.
     * @param jobType The type of job that you're creating
     * @param jobData The data needed when the job is running
     * @param queueName The name of the queue that the job should be added to
     * @param options The job options
     * @param userId Optional id of user that requested job
     */
    async queueJob<T = any>(jobType: string, jobData: T, queueName: string, options: JobOptions = {}, userId?: number) {
        const uuid = v1();
        try {
            debug(`Queueing job of type ${jobType} on the queue ${queueName}. Using the following data: `, jobData);
            const queue: Queue.Queue<DispatchJob<T>> = this.createQueue(queueName);

            await this.jobLogService.upsertJobLog({
                uuid,
                jobType,
                queueName,
                data: jobData,
                status: JobStatus.Queued,
                userId,
            });

            const dispatchData: DispatchJob<T> = {
                type: jobType,
                data: jobData,
                uuid,
                userId,
            };
            return await queue.add(queueName, dispatchData, options);
        } catch (e) {
            debug(`Failed to queue job of type ${jobType} with the following exception`, {
                message: e.message,
                stack: e.stack,
            });
            await this.jobLogService.upsertJobLog({
                uuid,
                jobType,
                queueName,
                data: jobData,
                status: JobStatus.Failed,
                error: e,
                userId,
            });
            throw e;
        }
    }

    /**
     * Here we create a queue but don't assign queue workers so that
     * we can queue things but don't actually process them.
     * @param queueName The name of the queue to create.
     */
    createQueue(queueName: string): Queue.Queue {
        this.logger.log({ message: `Creating the queue ${queueName}`, fn: this.createQueue.name });

        if (QueueService.queues[queueName]) {
            return QueueService.queues[queueName];
        }

        const queue = new Queue(queueName, {
            redis: {
                host: Config.get.queue.host,
                port: Config.get.queue.port,
            },
        });

        QueueService.queues[queueName] = queue;
        return queue;
    }

    async isHealthy(): Promise<boolean> {
        await this.getQueueStats();
        return true;
    }

    async getQueueStats() {
        const result: { [queueName: string]: Queue.JobCounts } = {};
        const queueNameKeys = Object.keys(QueueNames);

        for (const queueNameKey of queueNameKeys) {
            const queueName = QueueNames[queueNameKey];
            const queue = this.createQueue(queueName);

            result[queueName] = await queue.getJobCounts();
        }

        return result;
    }

    async clearQueue(queueName: string) {
        const queue = this.createQueue(queueName);

        const completed = await queue.clean(0, 'completed');
        const wait = await queue.clean(0, 'wait');
        const failed = await queue.clean(0, 'failed');
        const active = await queue.clean(0, 'active');
        const delayed = await queue.clean(0, 'delayed');
        await queue.empty();

        return {
            completed,
            wait,
            failed,
            active,
            delayed,
        };
    }

    async getFailedJobs(queueName: string) {
        const queue = this.createQueue(queueName);

        return await queue.getFailed();
    }

    async onModuleDestroy() {
        const queueNames = Config.get.queue.queueNamesArray();

        for await (const queueName of queueNames) {
            if (QueueService.queues[queueName]) {
                await QueueService.queues[queueName].close();
            }
        }
    }

    clearAll() {
        forEach(QueueService.queues, async (queue) => {
            await queue.clean(0, 'completed');
            await queue.clean(0, 'wait');
            await queue.clean(0, 'failed');
            await queue.clean(0, 'active');
            await queue.clean(0, 'delayed');
            await queue.empty();
        });
    }
}
