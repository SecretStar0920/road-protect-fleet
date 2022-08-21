export const databases = {
    main: {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        name: 'default',
    },
    general: {
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
    },
};
