import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Account, AccountDetails, AccountRelation, AccountReporting, AccountRole, LeaseContract } from '@entities';
import { Brackets } from 'typeorm';
import { isNil } from 'lodash';
import { CreateAccountRelationService } from '@modules/account-relation/services/create-account-relation.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { XlsxService } from '@modules/shared/modules/spreadsheet/services/xlsx.service';
import { CreateAccountV2Service } from '@modules/account/services/create-account-v2.service';
import { CreateAccountV2Dto } from '@modules/account/controllers/create-account-v2.dto';
import { EmailService, NoLogEmailTemplate } from '@modules/shared/modules/email/services/email.service';
import { AccountRelationGenerationEmail } from '@modules/shared/modules/email/interfaces/email.interface';

class SpreadsheetAccountData {

    name: string
    phone: string
    email: string
    sendEmail: boolean

}

interface SpreadsheetAccountDataMapper {

    map(rawData: any[]): SpreadsheetAccountData

}

class TaavuraSpreadsheetAccountDataMapper implements SpreadsheetAccountDataMapper {

    private clientNameIndex = 0
    private sendEmailIndex = 1
    private phoneNumberIndex = 4
    private emailIndex = 5

    map(rawData: any[]): SpreadsheetAccountData {
        if (rawData.length !== 9) {
            return null
        }

        const accountData = new SpreadsheetAccountData()
        accountData.name = rawData[this.clientNameIndex].replace("\"\"", "\"")
        accountData.sendEmail = rawData[this.sendEmailIndex] === 'כן'
        accountData.phone = rawData[this.phoneNumberIndex]
        accountData.email = rawData[this.emailIndex]

        return accountData;
    }

}



@Injectable()
export class GenerateAccountRelationService {

    private spreadsheetAccountDataMapper: SpreadsheetAccountDataMapper;

    constructor(
        private logger: Logger,
        private createAccountRelationService: CreateAccountRelationService,
        private createAccountService: CreateAccountV2Service,
        protected createDataSpreadsheetService: XlsxService,
        protected emailService: EmailService
    ) {
        this.spreadsheetAccountDataMapper = new TaavuraSpreadsheetAccountDataMapper()
    }

    async generateAccountRelationsFromSpreadsheet(accountId: number, file: Express.Multer.File): Promise<AccountRelation[]> {
        const json = await this.createDataSpreadsheetService.extractJsonFromBuffer(file)
        if (json.length <= 1) {
            throw new BadRequestException({
                message: ERROR_CODES.E271_BadAccountRelationsSpreadsheetFormat.message()
            })
        }

        json.shift()
        const accountsData = json.map((data) => {
            return this.spreadsheetAccountDataMapper.map(data)
        }).filter( (data) => {
            return data !== null
        })

        const relations = await AccountRelation.findWithMinimalRelations().where('reverse.accountId = :accountId', {
            accountId: accountId,
        }).getMany();

        const newDataMap = new Map<string, SpreadsheetAccountData>()
        for (const accountData of accountsData) {
            newDataMap.set(accountData.name, accountData)
        }

        const currentRelationsMap = new Map<string, AccountRelation>()
        for (let relation of relations) {
            const accountName = relation.forward.name
            currentRelationsMap.set(accountName, relation)
        }

        const updateAccounts: Account[] = []
        const deleteRelations: AccountRelation[] = []
        let createAccounts: SpreadsheetAccountData[] = []

        for (let relation of relations) {
            let relationAccount = relation.forward;
            if (!newDataMap.has(relationAccount.name)) {
                deleteRelations.push(relation)
                continue
            }

            const newData = newDataMap.get(relationAccount.name)!
            const currentSendEmail = relationAccount.accountReporting?.receiveWeeklyReport
            if (currentSendEmail !== newData.sendEmail) {
                if (!relationAccount.accountReporting) {
                    relationAccount.accountReporting = new AccountReporting()
                }

                relationAccount.accountReporting.receiveWeeklyReport = newData.sendEmail
                updateAccounts.push(relationAccount)
            }
        }

        for (let newData of accountsData) {
            if (!currentRelationsMap.has(newData.name)) {
                createAccounts.push(newData)
            }
        }

        const reportCreateAccounts = createAccounts
        createAccounts = []

        let errors: Error[] = []
        const missingAccounts = await this.createAccounts(createAccounts)
        errors = errors.concat(missingAccounts.errors.map((error) => {
            return new Error(`Could not create account: ${error.accountData.name}. Error: ${error.error.message}`)
        }))

        const missingRelations = await this.createRelations(accountId, missingAccounts.accounts)

        errors = errors.concat(missingAccounts.errors.map((error) => {
            return new Error(`Could not create relation: ${error.accountData.name}. Error: ${error.error.message}`)
        }))

        try {
            await Account.save(updateAccounts)
        } catch (e) {
            errors.push(new Error(`Could not save accounts. Error: ${e.message}`))
        }

        try {
            await this.sendSpreadsheetGenerationReport(accountId, reportCreateAccounts, deleteRelations, errors)
        } catch (e) {
            this.logger.error({
                message: 'Failed to email generation result',
                fn: this.generateAccountRelationsFromSpreadsheet.name,
                detail: e
            });
        }

        const totalRelations = relations.concat(missingRelations.relations)

        return totalRelations
    }

    private async sendSpreadsheetGenerationReport(
        accountId: number,
        createAccounts: SpreadsheetAccountData[],
        deleteRelations: AccountRelation[],
        errors: Error[],
        ): Promise<Boolean> {

        const context = new AccountRelationGenerationEmail()
        context.accountId = `${accountId}`
        context.newClients = createAccounts.map((accountData) => accountData.name)
        context.deleteClients = deleteRelations.map((deleteRelation) => `${deleteRelation.forward.name} (${deleteRelation.forward.accountId})`)
        context.errors = errors.map((error) => error.message)

        return this.emailService.sendEmail({
            template: NoLogEmailTemplate.AccountRelationsSpreadsheetGenerateResult,
            to: 'info@roadprotect.com',
            subject: `Account relations spreadsheet generated for ${accountId}`,
            context: context,
        }).then(() => true);
    }

    private async createAccounts(accountsData: SpreadsheetAccountData[]): Promise<{
        accounts: Account[],
        errors: {accountData: SpreadsheetAccountData, error: Error}[]
    }> {
        const accounts: Account[] = []
        const errors: {accountData: SpreadsheetAccountData, error: Error}[] = []

        for (let accountData of accountsData) {
            try {
                const createDto = this.createAccountDtoFromAccountData(accountData)
                const account = await this.createAccountService.createAccount(createDto)
                accounts.push(account)
            } catch (e) {
                errors.push({accountData: accountData, error: e})
            }
        }

        return {accounts: accounts, errors: errors}
    }

    private async createRelations(accountId, accounts: Account[]): Promise<{
        relations: AccountRelation[],
        errors: {account: Account, error: Error}[]
    }> {
        const relations: AccountRelation[] = []
        const errors: {account: Account, error: Error}[] = []
        for (let account of accounts) {
            try {
                const accountRelation = await this.createAccountRelationService.createAccountRelation({
                    forwardAccountId: account.accountId,
                    reverseAccountId: accountId,
                    data: {
                        summary: '[Automatically generated] Account from spreadsheet',
                        customFields: {},
                    },
                });

                relations.push(accountRelation)
            } catch (e) {
                errors.push({account: account, error: e})
            }
        }

        return {relations: relations, errors: errors}
    }

    private createAccountDtoFromAccountData(accountData: SpreadsheetAccountData): CreateAccountV2Dto {
        const createAccountDto = new CreateAccountV2Dto()
        createAccountDto.name = accountData.name
        createAccountDto.role = AccountRole.User
        createAccountDto.primaryContact = accountData.email
        createAccountDto.accountReporting = new AccountReporting()
        createAccountDto.accountReporting.receiveWeeklyReport = accountData.sendEmail

        createAccountDto.details = new AccountDetails()
        createAccountDto.details.name = accountData.name
        createAccountDto.details.telephone = accountData.phone

        return createAccountDto
    }

    async generateAccountRelationsFromContracts(accountId: number) {
        this.logger.log({
            message: 'Generating relations from existing contracts',
            detail: accountId,
            fn: this.generateAccountRelationsFromContracts.name,
        });
        const account = await Account.createQueryBuilder('account').where('account.accountId = :accountId', { accountId }).getOne();

        if (isNil(account)) {
            throw new BadRequestException({ message: ERROR_CODES.E026_CouldNotFindAccount.message({ accountId }) });
        }
        const asOwner = await LeaseContract.createQueryBuilder('contract')
            .addSelect(['contract.contractId'])
            .innerJoinAndSelect('contract.user', 'user')
            .addSelect(['user.accountId'])
            .innerJoinAndSelect('contract.owner', 'owner')
            .addSelect(['owner.accountId'])
            .distinctOn(['owner.accountId', 'user.accountId'])
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('owner.accountId = :accountId', { accountId });
                }),
            )
            .getMany();

        const asUser = await LeaseContract.createQueryBuilder('contract')
            .addSelect(['contract.contractId'])
            .innerJoinAndSelect('contract.user', 'user')
            .addSelect(['user.accountId'])
            .innerJoinAndSelect('contract.owner', 'owner')
            .addSelect(['owner.accountId'])
            .distinctOn(['owner.accountId', 'user.accountId'])
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('user.accountId = :accountId', { accountId });
                }),
            )
            .getMany();

        this.logger.debug({
            message: 'Found contracts',
            detail: { asOwner: asOwner.length, asUser: asUser.length },
            fn: this.generateAccountRelationsFromContracts.name,
        });

        const createdRelations: AccountRelation[] = [];
        for (const contract of asOwner) {
            const forwardAccountId = contract.user.accountId;
            const reverseAccountId = accountId;
            try {
                const accountRelation = await this.createAccountRelationService.createAccountRelation({
                    forwardAccountId,
                    reverseAccountId,
                    data: {
                        summary: '[Automatically generated] They use or have used vehicle(s) owned by this account',
                        customFields: {
                            'From contract with Id': contract.contractId,
                        },
                    },
                });
                createdRelations.push(accountRelation);
            } catch (e) {
                this.logger.error({
                    message: 'Failed to create a relation',
                    detail: { contractId: contract.contractId },
                    fn: this.generateAccountRelationsFromContracts.name,
                });
            }
        }

        for (const contract of asUser) {
            const forwardAccountId = contract.owner.accountId;
            const reverseAccountId = accountId;
            try {
                const accountRelation = await this.createAccountRelationService.createAccountRelation({
                    forwardAccountId,
                    reverseAccountId,
                    data: {
                        summary: '[Automatically Generated] They own or have owned vehicle(s) used by this account',
                        customFields: {
                            'From contract with Id': contract.contractId,
                        },
                    },
                });
                createdRelations.push(accountRelation);
            } catch (e) {
                this.logger.error({
                    message: 'Failed to create a relation',
                    detail: { contractId: contract.contractId },
                    fn: this.generateAccountRelationsFromContracts.name,
                });
            }
        }

        return createdRelations;
    }
}
