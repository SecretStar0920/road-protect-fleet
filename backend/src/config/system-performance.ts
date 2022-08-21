export const systemPerformance = {
    queryChunkSize: Number(process.env.QUERY_CHUNK_SIZE || 100),
    partialInfringementChunkSize: Number(1000),
    externalRequestConcurrentChunkSize: Number(process.env.EXTERNAL_REQUEST_CONCURRENT_CHUNK_SIZE || 10),
    defaultConcurrentJobs: Number(process.env.DEFAULT_CONCURRENT_JOBS || 5),
    safePromiseTimeoutMs: Number(process.env.SAFE_PROMISE_TIMEOUT_MS || 30000),
};
