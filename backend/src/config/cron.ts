export const cron = {
    enabled: Number(process.env.CRON_ENABLED) === 1 || (process.env.CRON_ENABLED || '').toString().toUpperCase() === 'true',
    initialSleep: Number(process.env.CRON_INITIAL_SLEEP || 30000),
};
