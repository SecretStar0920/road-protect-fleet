import { TypeOrmModule } from '@nestjs/typeorm';
import * as standardConfig from '@modules/shared/modules/database/database.config';
import * as testConfig from '@modules/shared/modules/database/database.test-config';
import { Config } from '@config/config';

const config = Config.get.isTesting() || Config.get.isDebug() ? testConfig : standardConfig;

export const databaseConnections = [TypeOrmModule.forRoot(config)];
