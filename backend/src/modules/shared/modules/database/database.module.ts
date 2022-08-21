import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseConnections } from '@modules/shared/modules/database/database-connections';

@Module({
    imports: [...databaseConnections],
    exports: [TypeOrmModule],
    providers: [],
})
export class DatabaseModule {}
