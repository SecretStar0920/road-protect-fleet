export const logs = {
    filenames: {
        all: 'log.log',
        error: 'error.log',
    },
    interceptor: {
        by: true,
        executionTime: true,
    },
    depth: Number(process.env.LOG_DEPTH || 10),
};
