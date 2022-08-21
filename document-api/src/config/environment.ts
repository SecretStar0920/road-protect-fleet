const env = (process.env.ENV || 'prod').toLowerCase();
export const isDevelopment = () => {
    return env === 'dev' || env === 'staging';
};

export const isProduction = () => {
    return env === 'prod' || env === 'production';
};

export const isStaging = () => {
    return env === 'staging';
};
