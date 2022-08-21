import { Config } from '@config/config';
import * as path from 'path';
import { ConnectionOptions } from 'typeorm';
import * as appRootPath from 'app-root-path';

const config: ConnectionOptions = {
    type: 'postgres',
    host: Config.get.databases.main.host,
    port: Config.get.databases.main.port,
    username: Config.get.databases.main.username,
    password: Config.get.databases.main.password,
    name: Config.get.databases.main.name,
    database: Config.get.databases.main.database,
    entities: [`${path.join(appRootPath.path, 'dist', 'modules', 'shared', 'entities')}/**/*entities.js`],
    logging: ['schema', 'error'],
    // See backend scripts for how to synchronize
    synchronize: false,
    cache: {
        type: 'redis',
        options: Config.get.redis,
    },
    cli: {
        migrationsDir: 'src/modules/shared/modules/database/migrations',
    },
    migrations: [
        `${path.join(appRootPath.path, 'dist', 'modules', 'shared', 'modules', 'database', 'migrations')}/**/*.js`,
        `${path.join(appRootPath.path, 'dist', 'modules', 'shared', 'modules', 'database', 'permanent-migrations')}/**/*.js`,
    ],
};
export = config;
