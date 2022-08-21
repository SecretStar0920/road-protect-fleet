import { Injectable } from '@nestjs/common';
import { RedisPublisherService } from '@modules/shared/modules/redis/redis-publisher.service';
import { RedisSubscriberService } from '@modules/shared/modules/redis/redis-subscriber.service';
import { fromEvent, Observable, Observer, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Logger } from '@logger';

export interface RedisSubscribeMessage {
    readonly message: string;
    readonly channel: string;
}

@Injectable()
export class RedisSubscriptionManagerService {
    constructor(
        private redisPublisherService: RedisPublisherService,
        private redisSubscriberService: RedisSubscriberService,
        private logger: Logger,
    ) {}

    public fromEvent<T>(eventName: string): Observable<T> {
        this.redisSubscriberService
            .client()
            .subscribe(eventName)
            .then(() =>
                this.logger.debug({
                    fn: this.fromEvent.name,
                    message: `Subscribed Redis client to ${eventName}`,
                }),
            );
        return fromEvent(this.redisSubscriberService.client(), 'message').pipe(
            filter((event: RedisSubscribeMessage) => event.channel === eventName),
            map((event: RedisSubscribeMessage) => JSON.parse(event.message) as T),
        );
    }

    public async publish(channel: string, value: unknown): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            return this.redisPublisherService.client().publish(channel, JSON.stringify(value), (error, reply) => {
                if (error) {
                    return reject(error);
                }
                return resolve(reply);
            });
        });
    }
}
