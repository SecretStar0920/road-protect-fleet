import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisPublisherService } from './redis-publisher.service';
import { RedisSubscriberService } from './redis-subscriber.service';
import { RedisSubscriptionManagerService } from '@modules/shared/modules/redis/redis-subscription-manager.service';

@Module({
    providers: [RedisService, RedisPublisherService, RedisSubscriberService, RedisSubscriptionManagerService],
    exports: [RedisService, RedisSubscriptionManagerService],
})
export class RedisModule {}
