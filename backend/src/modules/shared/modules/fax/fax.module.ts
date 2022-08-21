import { Module } from '@nestjs/common';
import { SendFaxService } from '@modules/shared/modules/fax/services/send-fax.service';
import { DocumentModule } from '@modules/document/document.module';

@Module({
    imports: [DocumentModule],
    providers: [SendFaxService],
    exports: [SendFaxService],
})
export class FaxModule {}
