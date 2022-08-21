export const redis = {
    host: process.env.STANDARD_REDIS_HOST || 'redis',
    port: Number(process.env.STANDARD_REDIS_PORT || 6379),
};
