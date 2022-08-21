import * as appRootPath from 'app-root-path';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { adminEmailAddresses } from './admin-email-addresses';
import { app } from './app';
import { automation } from './automation';
import { certificates } from './certficates';
import { crawlerConfig, crawlers } from './crawlers';
import { cron } from './cron';
import { databases } from './databases';
import { email } from './email';
import { externalStorageDirectory, storageDirectory } from './storage';
import { fax } from './fax';
import { google } from './google';
import { infringement } from './infringement';
import { infringementReportConfig } from './infringement-report';
import { isDebug, isDevelopment, isProduction, isStaging, isTesting } from './environment';
import { logs } from './logs';
import { mailerProcess } from './mailer-process';
import { metabase } from './metabase';
import { oldFleetSystemConfig } from './old-fleet-system';
import { payment } from './payment';
import { queue } from './queue';
import { rateLimit } from './rate-limit';
import { redirections } from './redirections';
import { redis } from './redis';
import { requestInformationConfig } from './request-information';
import { security } from './security';
import { siblings } from './siblings';
import { systemPerformance } from './system-performance';
import { systemSignature } from './system-signature';
import { vehicle } from './vehicle';
import { infringementOcrParser } from './infringement-ocr-parser';
import { graphing } from '@config/graphing';
import { clusterChangeEmailAddresses } from '@config/cluster-change-email-addresses';

export class Config {
    static hasRun = false;

    
    static get get() {
        if (!this.hasRun) {
            dotenv.config({ path: path.join(appRootPath.path, '.env') });
            this.hasRun = true;
        }

        return {
            app,
            env: process.env.ENV || 'prod',
            port: process.env.PORT || 3000,
            isDevelopment,
            isProduction,
            isStaging,
            isTesting,
            isDebug,
            storageDirectory,
            externalStorageDirectory,
            databases,
            redis,
            metabase,
            siblings,
            security,
            logs,
            email,
            adminEmailAddresses,
            clusterChangeEmailAddresses,
            google,
            infringementReportConfig,
            payment,
            fax,
            graphing,
            certificates,
            oldFleetSystemConfig,
            systemSignature,
            automation,
            infringement,
            vehicle,
            systemPerformance,
            crawlers,
            crawlerConfig,
            queue,
            mailerProcess,
            redirections,
            rateLimit,
            cron,
            requestInformationConfig,
            infringementOcrParser
        };
    }
}
