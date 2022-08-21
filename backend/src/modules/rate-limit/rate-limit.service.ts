import { Injectable } from '@nestjs/common';
import { RateLimitActions } from '@modules/rate-limit/rate-limit-actions.enum';
import { Config } from '@config/config';
import * as moment from 'moment-timezone';
import { Promax } from 'promax';
import { Cron } from '@nestjs/schedule';
import { RedisService } from '@modules/shared/modules/redis/redis.service';

@Injectable()
export class RateLimitService {
    private static actionLimits: { [action in RateLimitActions]?: number } = {};

    static addLimit(action: RateLimitActions, limit: number) {
        this.actionLimits[action] = limit;
    }

    static getLimit(action: RateLimitActions) {
        return this.actionLimits[action] || this.actionLimits.default;
    }

    private static rateLimitMessages: { [action in RateLimitActions]?: string } = {};

    static addRateLimitMessage(action: RateLimitActions, errorMessage: string) {
        this.rateLimitMessages[action] = errorMessage;
    }

    static getRateLimitMessage(action: RateLimitActions) {
        const message = this.rateLimitMessages[action] || `Rate limit exceeded`;
        return message.replace(/\{\{limit\}\}/g, RateLimitService.getLimit(action).toString());
    }

    constructor(private redisService: RedisService) {}

    async addAction(userIdOrPublicAction: number | string, action: RateLimitActions) {
        const key = `${Config.get.rateLimit.redis.prefix}:${userIdOrPublicAction}:${action}`;
        const timestamp = Date.now().toString();
        const length = await new Promise<number>((resolve, reject) =>
            this.redisService.client().lpush(key, timestamp, (err, reply) => {
                if (err) {
                    return reject(err);
                }
                resolve(reply);
            }),
        );

        const actionLimit = RateLimitService.getLimit(action);

        if (length > actionLimit) {
            await this.redisService.client().lpop(key);
            return {
                success: false,
                headers: {
                    'x-ratelimit-limit': actionLimit,
                    'x-ratelimit-remaining': 0,
                    'x-ratelimit-reset': moment().tz(Config.get.app.timezone).endOf('day').unix(),
                },
            };
        } else {
            return {
                success: true,
                headers: {
                    'x-ratelimit-limit': actionLimit,
                    'x-ratelimit-remaining': actionLimit - length,
                    'x-ratelimit-reset': moment().tz(Config.get.app.timezone).endOf('day').unix(),
                },
            };
        }
    }

    @Cron('0 0 * * *', {
        timeZone: Config.get.app.timezone,
    })
    async clearLimits() {
        const keys = await new Promise<string[]>((resolve, reject) => {
            this.redisService.client().keys(`${Config.get.rateLimit.redis.prefix}:*`, (err, reply) => {
                if (err) {
                    return reject(err);
                }
                resolve(reply);
            });
        });
        const promax = Promax.create(Config.get.systemPerformance.defaultConcurrentJobs, {
            throws: false,
        });
        await promax
            .add(
                keys.map((key) => async () =>
                    new Promise((resolve, reject) => {
                        this.redisService.client().del(key, (err, reply) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve(reply);
                        });
                    }),
                ),
            )
            .run();
        return promax.getResultMap();
    }
}
