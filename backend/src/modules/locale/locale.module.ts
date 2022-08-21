import { Module } from '@nestjs/common';
import { LocaleController } from './controllers/locale.controller';

@Module({
    controllers: [LocaleController],
})
export class LocaleModule {}
