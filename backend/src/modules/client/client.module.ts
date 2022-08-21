import { Module } from '@nestjs/common';
import { CreateClientService } from './services/create-client.service';
import { ClientController } from '@modules/client/controllers/client.controller';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [ClientController],
    providers: [CreateClientService],
    exports: [CreateClientService],
})
export class ClientModule {}
