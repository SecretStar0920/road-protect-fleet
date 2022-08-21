import { Module } from '@nestjs/common';
import { AccountRelationController } from './controllers/account-relation.controller';
import { CreateAccountRelationService } from './services/create-account-relation.service';
import { UpdateAccountRelationService } from './services/update-account-relation.service';
import { GetAccountRelationService } from './services/get-account-relation.service';
import { GetAccountRelationsService } from './services/get-account-relations.service';
import { DeleteAccountRelationService } from './services/delete-account-relation.service';
import { AccountRelationQueryController } from '@modules/account-relation/controllers/account-relation-query.controller';
import { GenerateAccountRelationService } from '@modules/account-relation/services/generate-account-relation.service';
import { AccountModule } from '@modules/account/account.module';

@Module({
    controllers: [AccountRelationController, AccountRelationQueryController],
    providers: [
        CreateAccountRelationService,
        UpdateAccountRelationService,
        GetAccountRelationService,
        GetAccountRelationsService,
        DeleteAccountRelationService,
        GenerateAccountRelationService,
    ],
    imports: [AccountModule],
})
export class AccountRelationModule {}
