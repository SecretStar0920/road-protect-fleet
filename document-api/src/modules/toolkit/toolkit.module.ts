import { Module } from '@nestjs/common';
import { ToolkitController } from './controllers/toolkit.controller';
import { MergeService } from './services/merge.service';

@Module({
    controllers: [ToolkitController],
    providers: [MergeService],
})
export class ToolkitModule {}
