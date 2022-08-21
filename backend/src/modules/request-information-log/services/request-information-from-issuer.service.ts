import { Logger } from '@logger';
import { Injectable } from '@nestjs/common';
import { Account, Issuer, RequestInformationLog } from '@entities';
import { isEmpty, isNil } from 'lodash';
import { RequestInformationFromIssuerEmail } from '@modules/shared/modules/email/interfaces/email.interface';
import { EmailService, EmailTemplate } from '@modules/shared/modules/email/services/email.service';
import * as moment from 'moment';
import { CreateRequestInformationLogService } from '@modules/request-information-log/services/create-request-information-log.service';
import { CreateRequestInformationLogDto } from '@modules/request-information-log/controllers/request-information-log.controller';
import { FeatureFlagHelper } from '@modules/shared/modules/feature-flag/helpers/feature-flag.helper';
import { Cron } from '@nestjs/schedule';
import { Config } from '@config/config';
import { DocumentFileDto, GetDocumentService } from '@modules/document/services/get-document.service';
import { MergePdfDocumentService } from '@modules/document/services/merge-pdf-document.service';
import { Document } from '@entities';

@Injectable()
export class RequestInformationFromIssuerService {
    constructor(
        private logger: Logger,
        private emailService: EmailService,
        private mergePdfDocumentService: MergePdfDocumentService,
        private createRequestInformationLogService: CreateRequestInformationLogService,
        private getDocumentService: GetDocumentService,
    ) {}

    // // run Monday to Friday at 7:00am UTC
    // @Cron('0 0 7 * * 1-5')
    // Disabled cron to ensure that information requests are not sent by mistake
    async scheduledSendingOfRequestsForInformation() {
        if (!(await FeatureFlagHelper.isEnabled({ title: 'scheduled-information-request-emails', defaultEnabled: false }))) {
            return;
        }

        // And their req logs & issuers from the last 30 days (to get the Issuers to be excluded for that account)
        const senderAccounts = await Account.findWithMinimalRelations()
            .leftJoinAndSelect(
                'account.accountRequestInformationLog',
                'requestInformationLog',
                `requestInformationLog.requestSendDate  >= now() - interval '30 day' OR requestInformationLog.responseReceivedDate  >= now() - interval '30 day'`,
            )
            .leftJoinAndSelect('requestInformationLog.issuer', 'issuer')
            .andWhere(`"account"."requestInformationDetails"->>'canSendRequest' = :canSend`, { canSend: true })
            .getMany();

        if (isEmpty(senderAccounts)) {
            this.logger.log({
                message: 'There are no accounts that can send information request emails',
                fn: this.scheduledSendingOfRequestsForInformation.name,
            });
            return;
        }

        return await Promise.all(
            senderAccounts.map(async (acc) => {
                const excludeIds = this.getIssuersToExculde(acc);
                let issuers = [];
                if (excludeIds.length > 0) {
                    issuers = await Issuer.createQueryBuilder('issuer')
                        .andWhere('issuer.email IS NOT NULL')
                        .andWhere('issuer.issuerId NOT IN (:...excludeIds)', { excludeIds })
                        .getMany();
                } else {
                    issuers = await Issuer.createQueryBuilder('issuer').andWhere('issuer.email IS NOT NULL').getMany();
                }

                if (isEmpty(issuers)) {
                    this.logger.warn({ message: 'No issuers to send to ', fn: this.sendRequestEmail.name });
                    return;
                }

                await this.sendRequestEmail(
                    issuers.map((iss) => {
                        return iss.issuerId;
                    }),
                    acc.accountId,
                );
            }),
        );
    }

    getIssuersToExculde(account: Account): number[] {
        return account.accountRequestInformationLog.map((reqLog) => {
            return reqLog.issuer.issuerId;
        });
    }

    async sendRequestEmail(issuerIds: number[], senderAccountId: number): Promise<RequestInformationLog[]> {
        this.logger.log({
            message: 'Sending email requesting information for the account and its relations: ',
            detail: senderAccountId,
            fn: this.sendRequestEmail.name,
        });

        const senderAccount = await Account.findWithMinimalRelations()
            .andWhere('account.accountId =:id', { id: senderAccountId })
            .andWhere(`"account"."requestInformationDetails"->>'canSendRequest' = :canSend`, { canSend: true })
            .getOne();


        // get power of attorny for all relevant accounts
        // TODO : Salman get list from managed accounts 
        let accountList: string[]=['512668021','511725434','510524283','520003781','514610559','512699000','510953904','512004235','512562422','510242670','510909450','550243356','510033822','512869777','570000745','510901309','511784308','520041682','513682625','514225044','520038985'];
        let poaAttachment:any[]=[];

        
        for(let accIdentifier of accountList)
        {
            let map=new Map();
            try{
                let currentAccount= await Account.findWithMinimalRelations()
                .andWhere('account.identifier =:id', { id: accIdentifier })
                .getOne();
                //get poa
                let poa=await this.getDocumentService.getDocumentFile(currentAccount.powerOfAttorney.documentId);
                
                poaAttachment.push({ 
                    "filename" : accIdentifier+'.pdf',
                    "content"  : poa.file,
                    });
            }
            catch (e)
            {
                this.logger.debug({
                    message: `Failed to get power of attorny document for account `+accIdentifier,
                    detail: { error: e },
                    fn: this.sendRequestEmail.name,
                });
            }
        }
      

        this.logger.log({
            message: 'Sending email document list ',
            detail: poaAttachment.length,
            fn: this.sendRequestEmail.name,
        });
        
        this.logger.log({
            message: 'Sending email requesting information from issuers: ',
            detail: issuerIds,
            fn: this.sendRequestEmail.name,
        });

        let issuers = await Issuer.findWithMinimalRelations().where('issuer.issuerId IN (:...ids)', { ids: issuerIds }).getMany();


        if (isEmpty(issuers)) {
            this.logger.warn({ message: 'No issuers were found: ', detail: issuerIds, fn: this.sendRequestEmail.name });
            return;
        }

        issuers = issuers.filter((issuer) => {
            const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (!isNil(issuer.email) && issuer.email.match(mailformat)) {
                return issuer;
            } else {
                this.logger.warn({
                    message: 'The issuer selected does not have a valid email address: ',
                    detail: issuer.name,
                    fn: this.sendRequestEmail.name,
                });
                return;
            }
        });


        const accounts = await this.getRelatedAccountsToRequest(senderAccountId);
        
        const successfulRequests: RequestInformationLog[] = [];

        // Get sender power of attorney
        if (!senderAccount.powerOfAttorney) {
            this.logger.error({ message: `Could not find power of attorney document`, fn: this.sendRequestEmail.name });
            return;
        }
      
        for (const issuer of issuers) {
            const context: RequestInformationFromIssuerEmail = {
                accountsToRequest: accounts,
                name: issuer.name,
                senderAccount,
            };

            let requestSuccessfullySent: boolean = false;
            const powerOfAttorneyDoc = await this.getDocumentService.getDocumentFile(senderAccount.powerOfAttorney.documentId);

            try {
                await this.emailService.sendEmail({
                    template: EmailTemplate.RequestInformationFromIssuer,
                    to: issuer.email,
                    subject: 'Information Request',
                    context,
                    from: Config.get.requestInformationConfig.fromEmailAddress,
                    attachments: poaAttachment,
                    lang: 'he',
                });

                requestSuccessfullySent = true;
            } catch (e) {
                this.logger.debug({
                    message: `Failed to send information request email `,
                    detail: { error: e },
                    fn: this.sendRequestEmail.name,
                });
            }

            if (requestSuccessfullySent) {
                const dto: CreateRequestInformationLogDto = {
                    requestSendDate: moment().toISOString(),
                    senderAccount,
                    issuer,
                    details: { requestEmailContext: context },
                };

                const savedLog = await this.createRequestInformationLogService.createRequestInformationLog(dto);
                successfulRequests.push(savedLog);
            }
        }
        return successfulRequests;
    }

    async getRelatedAccountsToRequest(senderAccountId: number) {
        /*  Accounts to include must:
         *       Be the forward relation in an Account Relation which has the sender account as the reverse account
         *       Have contract where the owner is the account included and the user is the sender account,
         *          this account cannot have expired more than 6 months ago
         *       Have a valid power of attorney
         * */

        const contractDateCutoff = Config.get.requestInformationConfig.contractCutoffInMonthsForIncludedAccounts;
        return Account.findWithMinimalRelations()
            .leftJoinAndSelect('account.forwardRelations', 'forwardRelations')
            .andWhere('forwardRelations.reverse.accountId =:id', { id: senderAccountId })
            .leftJoinAndSelect('account.asOwner', 'contract', 'contract.user.accountId =:id', { id: senderAccountId })
            .andWhere(`contract.endDate >= now() - (:contractDateCutoff || ' MONTH')::INTERVAL`, { contractDateCutoff })
            .andWhere('account.powerOfAttorney IS NOT NULL')
            .getMany();
    }
}
