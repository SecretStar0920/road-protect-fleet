import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ToolkitModule } from './modules/toolkit/toolkit.module';
import { SharedModule } from './modules/shared/shared.module';
import { ConvertModule } from './modules/convert/convert.module';

@Module({
    imports: [SharedModule, ToolkitModule, ConvertModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
