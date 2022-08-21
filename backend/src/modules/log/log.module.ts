import { Module } from '@nestjs/common';
import { Log } from '@entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@modules/shared/shared.module';
import { LogController } from '@modules/log/controllers/log.controller';
import { LogService } from '@modules/log/services/log.service';

@Module({
    controllers: [LogController],
    providers: [LogService],
    imports: [SharedModule, TypeOrmModule.forFeature([Log])],
})
export class LogModule {}
