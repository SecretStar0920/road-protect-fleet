import { Module } from '@nestjs/common';
import { AntivirusService } from '@modules/shared/modules/antivirus/antivirus.service';

@Module({
    providers: [AntivirusService],
    exports: [AntivirusService],
})
export class AntivirusModule {}
