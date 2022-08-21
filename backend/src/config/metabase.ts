import { requiredConfig } from './required-config.function';

export const metabase = {
    secret: process.env.METABASE_SECRET,
    url: process.env.METABASE_URL || requiredConfig('METABASE_URL'),
    dashboards: {
        account: process.env.METABASE_ACCOUNT_DASHBOARD_ID,
    },
    collections: {
        default: Number(process.env.METABASE_DEFAULT_COLLECTION_ID) || requiredConfig('METABASE_DEFAULT_COLLECTION_ID'),
        kpi: Number(process.env.METABASE_KPI_COLLECTION_ID) || requiredConfig('METABASE_KPI_COLLECTION_ID'),
    },
    apiUrl: process.env.METABASE_API_URL || requiredConfig('METABASE_API_URL'),
    apiCredentials: {
        username: process.env.METABASE_USERNAME || requiredConfig('METABASE_USERNAME'),
        password: process.env.METABASE_PASSWORD || requiredConfig('METABASE_PASSWORD'),
    },
    apiEndpoints: {
        login: 'session/',
        collections: 'collection/',
    },
};
