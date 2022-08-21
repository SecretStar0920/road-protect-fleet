const env = (process.env.ENV || 'prod').toLowerCase();
export const isDevelopment = () => {
    return env === 'dev' || env === 'development';
};

export const isStaging = () => {
    return env === 'staging' || env === 'staging';
};

export const isProduction = () => {
    return env === 'prod' || env === 'production';
};

export const isTesting = () => {
    return env === 'testing' || env === 'test';
};

export const isDebug = () => {
    return env === 'debug';
};
