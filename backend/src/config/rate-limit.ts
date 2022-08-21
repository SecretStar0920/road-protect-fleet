import { RateLimitActions } from '../modules/rate-limit/rate-limit-actions.enum';

export interface RateLimit {
    [key: string]: any;
    actions: { [key in RateLimitActions]: number };
}

export const rateLimit: RateLimit = {
    redis: {
        prefix: process.env.RATE_LIMIT_REDIS_PREFIX || 'RATE_LIMIT',
    },
    actions: {
        [RateLimitActions.createLeaseContract]: 1000,
        [RateLimitActions.createOwnerContract]: 1000,
        [RateLimitActions.createUser]: 10,
        [RateLimitActions.createVehicle]: 1000,
        [RateLimitActions.default]: 100000,
        [RateLimitActions.developerLogin]: 1000,
        [RateLimitActions.downloadDocument]: 500,
        [RateLimitActions.infringementReport]: 50,
        [RateLimitActions.login]: 100,
    },
};
