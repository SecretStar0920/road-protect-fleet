import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Account, AccountRole, Infringement, InfringementStatus } from '@entities';
import { isEmpty, isNil, get } from 'lodash';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import * as moment from 'moment';
import { Config } from '@config/config';
import { InfringementReportsEmail } from '@modules/shared/modules/email/interfaces/email.interface';
import { EmailService, EmailTemplate } from '@modules/shared/modules/email/services/email.service';
import { Logger } from '@logger';
import { XlsxService } from '../../shared/modules/spreadsheet/services/xlsx.service';
import { Cron } from '@nestjs/schedule';
import { FeatureFlagHelper } from '@modules/shared/modules/feature-flag/helpers/feature-flag.helper';
import { AccountInfringementReportDto } from '@modules/infringement/controllers/infringement-report.dto';
import { IInfringementReportOutcome } from '@modules/infringement/services/infringement-reporting-by-account-relation.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class InfringementReportingByAccountService {
    constructor(private logger: Logger, protected createDataSpreadsheetService: XlsxService, private emailService: EmailService) {}

    @Cron(Config.get.infringementReportConfig.accountCronFrequency)
    @Transactional()
    async sendBulkAccountsInfringementReports() {
        // Return is feature is not enabled
        if (!(await FeatureFlagHelper.isEnabled({ title: 'account-infringement-reports', defaultEnabled: false }))) {
            return;
        }

        // TODO: Remove managed where clause when needed
        const accounts = await Account.createQueryBuilder('account')
            .andWhere(`"account"."accountReporting"->>'receiveWeeklyReport' = :managed`, { managed: true })
            .getMany();

        for (const account of accounts) {
            if (isEmpty(account)) {
                return;
            }

            const queryDate = moment().add(`-${Config.get.infringementReportConfig.reportingPeriodInDays}`, 'day').toISOString();
            await this.sendOneAccountInfringementReport(account, queryDate);
        }
    }

    @Transactional()
    async sendOneAccountInfringementReportByAccountId(dto: AccountInfringementReportDto): Promise<IInfringementReportOutcome> {
        const account = await Account.createQueryBuilder('account').andWhere('account.accountId = :id', { id: dto.accountId }).getOne();

        if (isNil(account)) {
            throw new BadRequestException({
                message: ERROR_CODES.E026_CouldNotFindAccount.message(),
                context: { accountId: dto.accountId },
            });
        }

        return this.sendOneAccountInfringementReport(account, dto.queryDate);
    }

    @Transactional()
    private async sendOneAccountInfringementReport(account: Account, queryDate: string): Promise<IInfringementReportOutcome> {
        const openQuery = this.infringementReportBaseQueryByAccount(account);
        const deltaQuery = this.infringementReportBaseQueryByAccount(account);

        const openInfringements = await openQuery
            .andWhere('infringement.status NOT IN (:...status)', { status: [InfringementStatus.Paid, InfringementStatus.Closed] })
            .getMany();

        const openInfringementsReport = this.prepareInfringementReportData(openInfringements);

        const deltaInfringements = await deltaQuery
            .andWhere(
                new Brackets((qbb) => {
                    qbb.andWhere('infringement.createdAt >= :date', {
                        date: queryDate,
                    });
                    qbb.orWhere('infringement.updatedAt >= :date', {
                        date: queryDate,
                    });
                }),
            )
            .getMany();

        if (openInfringements.length === 0 && deltaInfringements.length === 0) {
            return { success: true, emailSent: false };
        }

        const deltaInfringementsReport = this.prepareInfringementReportData(deltaInfringements);

        const file = await this.createDataSpreadsheetService.createXLSXBufferWithMultipleSheets([
            { data: openInfringementsReport, sheetName: 'Open Infringements' },
            { data: deltaInfringementsReport, sheetName: 'Delta Infringements' },
        ]);

        const customisation = {
            emailBody: null,
            customSignature: null,
            cc: null,
            ...account.accountReporting,
        };

        const context: InfringementReportsEmail = {
            name: account.name,
            emailBody: customisation.emailBody,
            customSignature: customisation.customSignature,
        };

        await this.emailService.sendEmail({
            template: EmailTemplate.InfringementReports,
            to: account.primaryContact,
            subject: 'Infringement Report',
            context,
            cc: customisation.ccAddress,
            attachments: [
                {
                    filename: 'report.xlsx',
                    content: file,
                },
            ],
        });

        return { success: true, emailSent: true };
    }

    private infringementReportBaseQueryByAccount(account: Account): SelectQueryBuilder<Infringement> {
        const baseQuery = Infringement.findWithMinimalRelationsAndAccounts();

        if (account.role === AccountRole.Owner && account.managed === true) {
            baseQuery.andWhere(
                new Brackets((qb) => {
                    qb.andWhere('account.accountId = :id', { id: account.accountId });
                }),
            );
        } else {
            baseQuery.andWhere(
                new Brackets((qb) => {
                    qb.andWhere('user.accountId = :id', { id: account.accountId });
                    qb.orWhere('owner.accountId = :id', { id: account.accountId });
                }),
            );
        }

        return baseQuery;
    }

    private prepareInfringementReportData(infringements: Infringement[]) {
        const infringementsReport = [];
        for (const infringement of infringements) {
            if (isEmpty(infringement)) {
                return;
            }

            const penaltyAmount: number = Number(infringement.amountDue) - Number(infringement.originalAmount);

            infringementsReport.push({
                'מספר דוח/Infringement notice number': infringement.noticeNumber,
                'לוחית רישוי/Registration number': infringement.vehicle.registration,
                'לוחית רישוי/Vehicle owner': infringement.contract.owner.name,
                'שם משתמש/Vehicle user': get(infringement, 'contract.user.name', ''),
                'שם משתמש/Offence date': infringement.offenceDate,
                'ת.אחרון לתשלום/Last payment date': infringement.latestPaymentDate,
                'סכום מקורי/Original amount': infringement.originalAmount,
                'יתרה/Amount due': infringement.amountDue,
                'תוספת פיגורים/Penalty amount': penaltyAmount,
                'סכום שולם/Paid': infringement.nomination.paidDate,
                'סטטוס/Status': infringement.status,
                'כתובת עבירה/Offence address': infringement.location.streetName + ' ' + infringement.location.streetNumber,
                'עיר עבירה/Offence city': infringement.location.city,
                'סעיף עבירה/Reason code': infringement.reasonCode,
                'סעיף עבירה/Reason': infringement.reason,
                'תאריך סטטוס/Status date': infringement.nomination.redirectedDate,
                'לצפיה במערכת/Link': `${Config.get.app.url}/home/infringements/view/${infringement.infringementId}`,
            });
        }

        return infringementsReport;
    }
}
