import { Config } from '@config/config';
import { JobOptions } from 'bull';
import { QueueService } from './services/queue.service';
import { QueueException } from '@modules/queue/queue.exception';
import * as d from 'debug';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

const debug = d('fleet:queue');

/**
 * This is the base of a queueable job, the services that extend
 * this MUST be injectable and be injected in their modules for
 * this system to work.
 */
export abstract class QueueableJob<T> {
    private _queueService: QueueService;

    public queueName = Config.get.queue.defaultQueueName;

    constructor(queueService: QueueService) {
        this._queueService = queueService;

        if (!this._queueService) {
            throw new QueueException(ERROR_CODES.E158_QueueServiceIsNull.message({ serviceName: this.constructor.name }));
        }
    }

    abstract async run(data: T);

    async dispatchJob(data: T = null, options: JobOptions = {}, userId?: number) {
        debug(`Dispatching job with name ${this.constructor.name} on queue ${this.queueName}`);
        return await this._queueService.queueJob<T>(this.constructor.name, data, this.queueName, options, userId);
    }
}
