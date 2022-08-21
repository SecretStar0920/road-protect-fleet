import { Module } from '@nestjs/common';
import { StreetController } from './controllers/street.controller';
import { StreetService } from './services/street.service';

@Module({
    controllers: [StreetController],
    providers: [StreetService],
    imports: [],
})
export class StreetModule {}
