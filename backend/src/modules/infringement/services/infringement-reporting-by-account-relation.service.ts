import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Account, AccountRelation, Infringement, InfringementStatus } from '@entities';
import { get, isEmpty, isNil } from 'lodash';
import { SelectQueryBuilder } from 'typeorm';
import * as moment from 'moment';
import { Config } from '@config/config';
import { EmailContext, InfringementReportsEmail } from '@modules/shared/modules/email/interfaces/email.interface';
import { EmailService, EmailTemplate } from '@modules/shared/modules/email/services/email.service';
import { Logger } from '@logger';
import { SPREADSHEET_CELL_FORMATS, XlsxService } from '../../shared/modules/spreadsheet/services/xlsx.service';
import { Cron } from '@nestjs/schedule';
import { FeatureFlagHelper } from '@modules/shared/modules/feature-flag/helpers/feature-flag.helper';
import { AccountRelationInfringementReportDto } from '@modules/infringement/controllers/infringement-report.dto';
import { ExcelDataType } from 'xlsx';
import { ExcelJsService } from '@modules/shared/modules/spreadsheet/services/excel-js.service';
import { adjustUTCToTimezone } from '@modules/shared/helpers/timezone-conversion';
import * as fs from 'fs-extra';
import { documentApi } from '@modules/shared/models/document-api.model';
import { InfringementReportingGenerateHtmlService } from '@modules/infringement/services/infringement-reporting-generate-html.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export interface IInfringementReportOutcome {
    // Function ran successfully
    success: boolean;
    // Email was sent, function can run successfully without sending an email if account doesnt have infringements to report
    emailSent: boolean;
    // Reporting data for testing purposes
    data?: any;
}

export interface IInfringementEmailDetails {
    context: EmailContext;
    ccAddresses: string[];
}

@Injectable()
export class InfringementReportingByAccountRelationService {
    private languageTranslation = {
        vehicleRegistration: 'לוחית רישוי',
        contractOwnerName: 'שם בעלים',
        noticeNumber: 'מספר דוח',
        brn: 'חפ ברשות',
        name: 'ח.פ. בעירייה',
        offenceDate: 'תאריך עבירה',
        originalAmount: 'סכום מקורי',
        amountDue: 'יתרה',
        location: 'כתובת עבירה',
        lastPaymentDate: 'ת.אחרון לתשלום',
        externalChangeDate: 'תאריך אימות אחרון',
        issuer: 'עיר עבירה',
        reportDate: 'תאריך דוח',
        totalInfringements: 'סה"כ דוחות לתשלום',
        numberOfOpenInfringementsAtOriginalAmount: 'כמות קנסות בסכום המקורי',
        numberOfInfringementsWithPenalties: 'כמות קנסות עם פיגורים',
        numberOfVehiclesWithInfringements: 'כמות רכבים עם קנסות',
        numberOfIssuersWithInfringements: 'כמות רשויות שנתנו קנסות',
        totalOriginalAmount: 'סה"כ סכום מקורי לתשלום',
        totalAmountDue: 'סה"כ יתרה לתשלום',
        emailSubject: 'דו"חות חניה ממתינים לתשלום',
    };

    constructor(
        private logger: Logger,
        protected xlsxService: XlsxService,
        private excelJsService: ExcelJsService,
        private emailService: EmailService,
        private infringementReportingGenerateHtmlService: InfringementReportingGenerateHtmlService,
    ) {}

    @Cron(Config.get.infringementReportConfig.accountRelationCronFrequency, {
        timeZone: Config.get.app.timezone,
    })
    @Transactional()
    async scheduledSendBulkAccountRelationsInfringementReports() {
        if (
            !(await FeatureFlagHelper.isEnabled({
                title: 'account-relation-infringement-reports-scheduled-sending',
                defaultEnabled: false,
            }))
        ) {
            this.logger.debug({
                message: 'Account Relations Feature Flag is disabled. ',
                detail: {
                    title: 'account-relation-infringement-reports-scheduled-sending',
                },
                fn: this.scheduledSendBulkAccountRelationsInfringementReports.name,
            });
            return;
        }
        return this.sendBulkAccountRelationsInfringementReports();
    }

    @Transactional()
    async sendBulkAccountRelationsInfringementReports() {
        this.logger.debug({
            message: 'Sending bulk account relation infringement reports',
            fn: this.sendBulkAccountRelationsInfringementReports.name,
        });

        if (!(await FeatureFlagHelper.isEnabled({ title: 'account-relation-infringement-reports', defaultEnabled: false }))) {
            return;
        }

        // TODO: Remove managed where clause when needed
        const accountRelations = await AccountRelation.findWithMinimalRelations()
            .addSelect(['forward.primaryContact', 'reverse.accountReporting'])
            .andWhere(`"accountRelation"."accountRelationReporting"->>'receiveWeeklyReport' = :managed`, { managed: true })
            .getMany();

        this.logger.debug({
            message: `Found ${accountRelations.length} relations to send reports to`,
            fn: this.sendBulkAccountRelationsInfringementReports.name,
        });

        const successfulSends = [];
        const failedSends = [];

        if (isEmpty(accountRelations)) {
            return;
        }

        for (const accountRelation of accountRelations) {
            if (isEmpty(accountRelation)) {
                continue;
            }

            try {
                const queryDate = moment().add(`-${Config.get.infringementReportConfig.reportingPeriodInDays}`, 'day').toISOString();
                const result = await this.sendOneAccountRelationInfringementReport(accountRelation, queryDate);
                successfulSends.push({ result, accountRelation });
            } catch (e) {
                this.logger.error({
                    message: `Failed to send account relation report`,
                    detail: { error: e, accountRelation },
                    fn: this.sendBulkAccountRelationsInfringementReports.name,
                });
                failedSends.push({ error: e, accountRelation });
            }
        }

        this.logger.debug({
            message: `Finished account relation sends`,
            detail: { successfulSends, failedSends },
            fn: this.sendBulkAccountRelationsInfringementReports.name,
        });

        return { successfulSends, failedSends };
    }

    @Transactional()
    async sendOneAccountRelationInfringementReportByAccountRelationId(
        dto: AccountRelationInfringementReportDto,
    ): Promise<IInfringementReportOutcome> {
        const accountRelation = await AccountRelation.findWithMinimalRelations()
            .addSelect(['forward.primaryContact', 'reverse.accountReporting', 'reverse.identifier'])
            .andWhere(`accountRelation.accountRelationId = :id`, { id: dto.accountRelationId })
            .getOne();

        if (isNil(accountRelation)) {
            throw new BadRequestException({
                message: ERROR_CODES.E012_CouldNotFindAccountRelation.message({ accountRelationId: dto.accountRelationId }),
            });
        }

        return this.sendOneAccountRelationInfringementReport(accountRelation, dto.queryDate);
    }

    @Transactional()
    private async sendOneAccountRelationInfringementReport(
        accountRelation: AccountRelation,
        queryDate: string,
    ): Promise<IInfringementReportOutcome> {
        this.logger.debug({
            message: `Sending account relation infringement report for account relation ${accountRelation.accountRelationId}`,
            detail: { accountRelation, queryDate },
            fn: this.sendOneAccountRelationInfringementReport.name,
        });

        const timezone = get(accountRelation, 'accountRelationReporting.timezone', 'Asia/Jerusalem');

        const openQuery = this.infringementReportBaseQueryByAccountRelation(accountRelation);
        // const deltaQuery = this.infringementReportBaseQueryByAccountRelation(accountRelation);

        let openInfringements = await openQuery
            .andWhere('infringement.status NOT IN (:...status)', { status: [InfringementStatus.Paid, InfringementStatus.Closed] })
            .orderBy('infringement.offenceDate', 'DESC')
            .getMany();

        openInfringements = this.filterInvalidInfringements(openInfringements, accountRelation);

        const preparedOpenInfringements = await this.prepareInfringementReportData(openInfringements, timezone);

        const openInfringementsReport = preparedOpenInfringements.infringementsReport;
        const numberFormatOptions = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        };
        const originalAmount = '₪' + Number(preparedOpenInfringements.originalAmountSum).toLocaleString('he-IL', numberFormatOptions);
        const amountDue = '₪' + Number(preparedOpenInfringements.amountDueSum).toLocaleString('he-IL', numberFormatOptions);
        const penaltyAmount = '₪' + Number(preparedOpenInfringements.penaltyAmountSum).toLocaleString('he-IL', numberFormatOptions);

        // Not sending delta reports at this stage
        if (openInfringements.length === 0) {
            this.logger.debug({
                message: `There are no open infringements found for account relation: ${accountRelation.accountRelationId}`,
                detail: { queryDate },
                fn: this.sendOneAccountRelationInfringementReport.name,
            });
            return { success: true, emailSent: false, data: null };
        }

        const countValues = {
            issuerCount: this.countDistinctIssuers(openInfringements),
            vehicleCount: this.countDistinctVehicles(openInfringements),
        };

        const countOpenInfringementsAtOriginalAmount = this.countInfringementsAtOriginalAmount(openInfringements);
        const countOpenInfringementsWithPenalties = this.countInfringementsWithPenalties(openInfringements);

        const openInfringementsTotal = openInfringements.map((o) => Number(o.amountDue)).reduce((a, b) => a + b, 0);

        const summarySheet = [];
        // Report date
        summarySheet.push({
            Property: this.languageTranslation.reportDate,
            Value: moment(adjustUTCToTimezone(moment().toISOString(), timezone)).format('DD/MM/YYYY HH:mm:ss'),
        });
        // Number of open infringements
        summarySheet.push({ Property: this.languageTranslation.totalInfringements, Value: openInfringements.length });
        // Number of infringements at original amount (without penalties)
        summarySheet.push({
            Property: this.languageTranslation.numberOfOpenInfringementsAtOriginalAmount,
            Value: countOpenInfringementsAtOriginalAmount,
        });
        // Number of Infringements with penalties
        summarySheet.push({
            Property: this.languageTranslation.numberOfInfringementsWithPenalties,
            Value: countOpenInfringementsWithPenalties,
        });
        // Number of vehicles with infringements
        summarySheet.push({ Property: this.languageTranslation.numberOfVehiclesWithInfringements, Value: +countValues.vehicleCount });
        // Number of Issuers information was gathered from
        summarySheet.push({ Property: this.languageTranslation.numberOfIssuersWithInfringements, Value: +countValues.issuerCount });

        // Total original amount
        summarySheet.push({ Property: this.languageTranslation.totalOriginalAmount, Value: originalAmount });
        // Total amount due
        summarySheet.push({
            Property: this.languageTranslation.totalAmountDue,
            Value: '₪' + Number(openInfringementsTotal).toLocaleString('he-IL', numberFormatOptions),
        });

        const workbook = await this.xlsxService.createWorkbookWithMultipleSheets([
            { data: summarySheet, sheetName: 'Summary' },
            { data: openInfringementsReport, sheetName: 'Open Infringements' },
        ]);

        // Insert totals
        const endRow = this.xlsxService.getEndRow(workbook, 'Open Infringements');
        this.xlsxService.addTotal(workbook, 'Open Infringements', 6, originalAmount, endRow);
        this.xlsxService.addTotal(workbook, 'Open Infringements', 7, amountDue, endRow);

        const dateFormat = SPREADSHEET_CELL_FORMATS.Israel.date;
        this.xlsxService.setCellFormatAndType(workbook, 'Summary', 'B2', dateFormat.format, 'd');

        this.xlsxService.setColumnFormat(workbook, 'Open Infringements', 5, dateFormat.format, dateFormat.type as ExcelDataType);
        this.xlsxService.setColumnFormat(workbook, 'Open Infringements', 10, dateFormat.format, dateFormat.type as ExcelDataType);
        this.xlsxService.setColumnFormat(workbook, 'Open Infringements', 11, dateFormat.format, dateFormat.type as ExcelDataType);

        // Save file
        const file = await this.xlsxService.writeWorkbookToBuffer(workbook);
        const styled = await this.excelJsService.createWorkbookFromBuffer(file);

        await styled.csv.writeFile(Config.get.storageDirectory() + '/openInfringements.csv', {
            encoding: 'utf8',
            dateFormat: 'DD/MM/YYYY hh:mm:ss',
            dateUTC: false,
            sheetName: 'Open Infringements',
            formatterOptions: {
                writeBOM: true, // To make sure that Excel opens csv with UTF-8
            },
        });

        const csvBuffer = await styled.csv.writeBuffer({
            encoding: 'utf8',
            dateFormat: 'DD/MM/YYYY hh:mm:ss',
            dateUTC: false,
            sheetName: 'Open Infringements',
            formatterOptions: {
                writeBOM: true, // To make sure that Excel opens csv with UTF-8
            },
        });

        const details: IInfringementEmailDetails = this.selectMostSpecificEmailContext(accountRelation);

        const summaryPageHtml: string = this.infringementReportingGenerateHtmlService.generateSummaryPageHtml(
            summarySheet,
            accountRelation.forward.name,
        );

        const summaryPagePdf: Buffer = await documentApi.htmlToPdf(summaryPageHtml);

        await fs.writeFile(Config.get.storageDirectory() + '/summaryPagePdf.pdf', summaryPagePdf);

        this.logger.debug({
            message: `Sending account relation infringement report email`,
            detail: { queryDate },
            fn: this.sendOneAccountRelationInfringementReport.name,
        });

        try {
            await this.emailService.sendEmail({
                template: EmailTemplate.InfringementReports,
                from:'support@roadprotect.co.il',
                to: accountRelation.forward.primaryContact,
                subject: this.languageTranslation.emailSubject,
                context: details.context,
                cc: Config.get.mailerProcess.ccAddress.concat(details.ccAddresses || []),
                lang: 'he',
                attachments: [
                    {
                        filename: 'openInfringements.csv',
                        content: csvBuffer as Buffer,
                    },
                    {
                        filename: 'summaryPagePdf.pdf',
                        content: summaryPagePdf,
                    },
                ],
            });
        } catch (e) {
            this.logger.debug({
                message: `Failed to send the email`,
                detail: { error: e },
                fn: this.sendOneAccountRelationInfringementReport.name,
            });
            return { success: false, emailSent: false, data: { summarySheet, openInfringements } };
        }

        return { success: true, emailSent: true, data: { summarySheet, openInfringements } };
    }

    private selectMostSpecificEmailContext(accountRelation: AccountRelation): IInfringementEmailDetails {
        this.logger.debug({
            message: `Selecting most specific email customisation template`,
            detail: { accountRelation },
            fn: this.selectMostSpecificEmailContext.name,
        });
        let customisation = {
            emailBody: null,
            customSignature: null,
            customHeader: null,
            customFooter: null,
            ccAddress: null,
        };

        // AccountRelation's reporting takes preference.
        // If not set then use reverse account's forwardRelationReportingTemplate.
        // Default template is used if neither are specified.
        if (get(accountRelation, 'accountRelationReporting', false)) {
            this.logger.debug({
                message: `Selected accountRelation template`,
                detail: { template: get(accountRelation, 'accountRelationReporting') },
                fn: this.selectMostSpecificEmailContext.name,
            });
            customisation = {
                ...customisation,
                ...accountRelation.accountRelationReporting,
            };
        } else if (get(accountRelation, 'reverse.accountReporting.forwardRelationReportingTemplate', false)) {
            this.logger.debug({
                message: `Selected account template`,
                detail: { template: get(accountRelation, 'reverse.accountReporting.forwardRelationReportingTemplate') },
                fn: this.selectMostSpecificEmailContext.name,
            });
            customisation = {
                ...customisation,
                ...accountRelation.reverse.accountReporting.forwardRelationReportingTemplate,
            };
        } else {
            this.logger.debug({
                message: `Selected default (empty) template`,
                fn: this.selectMostSpecificEmailContext.name,
            });
        }

        if (customisation.emailBody) {
            customisation.emailBody = customisation.emailBody.replace('{{name}}', accountRelation.forward.name);
        }
        const context: InfringementReportsEmail = {
            name: accountRelation.forward.name,
            emailBody: customisation.emailBody,
            customSignature: customisation.customSignature,
            customHeader: customisation.customHeader,
            customFooter: customisation.customFooter,
        };

        return { context, ccAddresses: customisation.ccAddress };
    }

    private infringementReportBaseQueryByAccountRelation(accountRelation: AccountRelation): SelectQueryBuilder<Infringement> {
        const baseQuery = Infringement.findWithMinimalRelationsAndAccounts();

        baseQuery
            .andWhere('((brn = :reverseIdentifier)  OR (brn IS NULL AND owner.accountId = :ownerId ))', {
                reverseIdentifier: accountRelation.reverse.identifier,
                ownerId: accountRelation.reverse.accountId,
            })
            .andWhere(
                '((user.accountId = :forwardId AND owner.accountId = :reverseId) OR (user.accountId = :reverseId AND owner.accountId = :forwardId))',
                {
                    forwardId: accountRelation.forward.accountId,
                    reverseId: accountRelation.reverse.accountId,
                },
            )
            .andWhere('account.accountId = :forwardId', {
                forwardId: accountRelation.forward.accountId,
            });

        return baseQuery;
    }

    private async prepareInfringementReportData(infringements: Infringement[], timezone: string) {
        const infringementsReport: { [key: string]: string }[] = [];
        let originalAmountSum: number = 0;
        let penaltyAmountSum: number = 0;
        let amountDueSum: number = 0;
        for (const infringement of infringements) {
            if (isEmpty(infringement)) {
                return;
            }

            try {
                originalAmountSum = originalAmountSum + Number(infringement.originalAmount);
                penaltyAmountSum = penaltyAmountSum + Number(infringement.penaltyAmount);
                amountDueSum = amountDueSum + Number(infringement.amountDue);

                const locationField = (infringement.location || {}).address || (infringement.location || {}).rawAddress || '';

                infringementsReport.push({
                    [this.languageTranslation.vehicleRegistration]: infringement.vehicle.registration, // 0
                    [this.languageTranslation.contractOwnerName]: infringement.contract.owner.name, // 1
                    // 'שם משתמש / Vehicle user': get(infringement, 'contract.user.name', ''),
                    [this.languageTranslation.noticeNumber]: infringement.noticeNumber, // 2
                    [this.languageTranslation.brn]: infringement.brn, // 3 'חפ ברשות / BRN as per Issuer': infringement.brn,
                    [this.languageTranslation.name]: await this.findAccountNameFromIssuer(infringement.brn), // 4 'חפ ברשות / account name as per Issuer': infringement.brn,
                    // 'סטטוס / Status': infringement.status,
                    [this.languageTranslation.offenceDate]: adjustUTCToTimezone(infringement.offenceDate, timezone), // 5
                    [this.languageTranslation.originalAmount]: '₪' + Number(infringement.originalAmount).toLocaleString('he-IL'), // 6
                    // 'תוספת פיגורים': '₪' + Number(infringement.penaltyAmount).toLocaleString('he-IL'), // 5
                    [this.languageTranslation.amountDue]: '₪' + Number(infringement.amountDue).toLocaleString('he-IL'), // 7
                    [this.languageTranslation.location]: locationField.replace(/[\n\r]/g, ' '), // 8
                    [this.languageTranslation.issuer]: (infringement.location || {}).city || infringement.issuer.name, // 9
                    // 'סעיף עבירה': infringement.reasonCode, // 9
                    // 'תיאור עבירה': (infringement.reason || '').replace(/[\n\r]/g, ' '), // 10
                    // 'תאריך סטטוס / Status date': adjustUTCToTimezone(get(infringement, 'infringementLogs.0.createdAt', null), timezone),
                    [this.languageTranslation.lastPaymentDate]: adjustUTCToTimezone(infringement.latestPaymentDate, timezone), // 10
                    [this.languageTranslation.externalChangeDate]: adjustUTCToTimezone(infringement.externalChangeDate, timezone), // 11
                    // 'תאריך בתשלום / Paid date': adjustUTCtoTimezone(nomination.paidDate, timezone),
                    // 'לצפיה במערכת/Link': `${Config.get.app.url}/home/infringements/view/${infringement.infringementId}`, // 15
                });
            } catch (e) {
                this.logger.error({
                    message: 'Infringement could not be reported as there is an error with its data',
                    detail: { infringement, message: e.message },
                    fn: this.prepareInfringementReportData.name,
                });
            }
        }

        return { infringementsReport, originalAmountSum, penaltyAmountSum, amountDueSum };
    }

    private async findAccountNameFromIssuer(brn: string): Promise<string> {
        const account = await Account.findByIdentifierOrId(brn);
        if (!account) {
            return '-';
        }
        return account.name;
    }

    private countDistinctIssuers(openInfringements: Infringement[]) {
        const found: { [issuerId: number]: true } = {};
        let count = 0;
        for (const openInfringement of openInfringements) {
            if (found[openInfringement.issuer.issuerId]) {
                continue;
            }
            found[openInfringement.issuer.issuerId] = true;
            count++;
        }
        return count;
    }

    private countDistinctVehicles(openInfringements: Infringement[]) {
        const found: { [vehicleId: number]: true } = {};
        let count = 0;
        for (const openInfringement of openInfringements) {
            if (found[openInfringement.vehicle.vehicleId]) {
                continue;
            }
            found[openInfringement.vehicle.vehicleId] = true;
            count++;
        }
        return count;
    }

    private countInfringementsAtOriginalAmount(openInfringements: Infringement[]) {
        let count = 0;
        for (const openInfringement of openInfringements) {
            if (Number(openInfringement.amountDue) <= Number(openInfringement.originalAmount)) {
                count++;
            }
        }
        return count;
    }

    private countInfringementsWithPenalties(openInfringements: Infringement[]) {
        let count = 0;
        for (const openInfringement of openInfringements) {
            if (Number(openInfringement.amountDue) > Number(openInfringement.originalAmount)) {
                count++;
            }
        }
        return count;
    }

    private filterInvalidInfringements(openInfringements: Infringement[], accountRelation: AccountRelation): Infringement[] {
        if (Config.get.mailerProcess.minimumVerificationDays === -1) {
            return openInfringements;
        }
        const minimumDate = moment().subtract(Config.get.mailerProcess.minimumVerificationDays, 'days').startOf('day');
        const invalidInfringements = openInfringements.filter((inf) => moment(inf.externalChangeDate).isBefore(minimumDate));
        if (invalidInfringements.length > 0) {
            this.logger.warn({
                fn: this.sendOneAccountRelationInfringementReport.name,
                message: `There are ${invalidInfringements.length} infringements for account relation ${accountRelation.accountRelationId}`,
                detail: { invalidInfringements },
            });
        }
        return openInfringements.filter((inf) => moment(inf.externalChangeDate).isSameOrAfter(minimumDate));
    }
}
