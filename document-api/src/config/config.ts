import * as appRootPath from 'app-root-path';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { databases } from './databases';
import { isDevelopment, isProduction, isStaging } from './environment';
import { storageDirectory } from './storage';
import { logs } from './logs';

export class Config {
    static hasRun = false;

    static get get() {
        if (!this.hasRun) {
            dotenv.config({ path: path.join(appRootPath.path, '.env') });
            this.hasRun = true;
        }

        return {
            databases,
            env: process.env.ENV || 'prod',
            isDevelopment,
            isProduction,
            isStaging,
            port: Number(process.env.PORT || 8080),
            storageDirectory,
            logs,
        };
    }
}
