import { Injectable, NotFoundException } from '@nestjs/common';
import { Account, AccountRole, ContractStatus, InfringementStatus } from '@entities';
import { HomeReportingQueryService, VehicleEndpoints } from '@modules/reporting/home-reporting/services/home-reporting-query.service';
import { Logger } from '@logger';
import moment = require('moment');
import { Config } from '@config/config';
import { InfringementVerificationProvider } from '@config/infringement';
import { NominationStatus } from '@modules/shared/models/nomination-status';
import { EmailService, EmailTemplate } from '@modules/shared/modules/email/services/email.service';
import { AccountReportEmail } from '@modules/shared/modules/email/interfaces/email.interface';
import { AppRoutesProviderService } from '@modules/shared/services/app-routes-provider.service';
import { Brackets } from 'typeorm';
import { Promax } from 'promax';
import BigNumber from 'bignumber.js';
import { FeatureFlagHelper } from '@modules/shared/modules/feature-flag/helpers/feature-flag.helper';

class InfringementsData {

    totalInfringementsCount: string
    totalInfringementsCost: string

    totalPaidInfringements: string

    totalOutstandingSoon: string
    totalOutstanding: string

    allInfringementsLink: string
    outstandingSoonInfringementsLink: string
    outstandingInfringementsLink: string

}

class TopIssuer {
    constructor(public name: string, public infringements: string) {}
}

class IssuersData {

    totalIssuersCount: string
    policeIssuer: TopIssuer
    topIssuers: TopIssuer[]

}

class VehiclesData {

    totalVehiclesCount: string
    totalLeasedVehiclesCount: string
    totalLeasedExpiredVehiclesCount: string

    allVehiclesLink: string
}

class RedirectionsData {

    totalRedirectionsCount: string
    totalFinishedRedirectionsCount: string
    totalInProgressRedirectionsCount: string

}

export class AccountReportData {

    clientName: string
    currentDate: string

    infringements: InfringementsData
    issuers: IssuersData
    vehicles: VehiclesData
    redirections: RedirectionsData

}

@Injectable()
export class AccountReportNotificationService {

    private priceFormatter: Intl.NumberFormat
    private numberFormatter: Intl.NumberFormat

    constructor(
        private logger: Logger,
        private accountReportingQueryService: HomeReportingQueryService,
        private appRoutesProviderService: AppRoutesProviderService,
        private emailService: EmailService
    ) {
        this.priceFormatter = new Intl.NumberFormat('he-IL', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })

        this.numberFormatter = new Intl.NumberFormat('he-IL', {
            style: 'decimal',
            maximumFractionDigits: 0,
        })
    }

    async sendReportToAllAccounts(): Promise<boolean> {

        const isReportingEnabled = await FeatureFlagHelper.isEnabled({
            title: 'account-weekly-reporting',
            defaultEnabled: true,
        })

        if (!isReportingEnabled) {
            return true
        }

    

        const accounts = await Account.findWithMinimalRelations()
            .andWhere('manage=true')
            .getMany()

        this.logger.debug({
            message: `Sending report to ${accounts.length} accounts.`,
            fn: this.sendReportToAccount.name,
        })
        
        const executor = Promax.create(Config.get.systemPerformance.defaultConcurrentJobs, {
            throws: true,
        });

        let sendReportJobs = accounts.map((account) => {
            return () => this.sendReportToAccount(account)
        });

        executor.add(sendReportJobs)
        await executor.run();
       
        return true
    }

    async sendReportToAccountsWithIdentifier(identifier: string): Promise<boolean> {

        const account = await Account.findOneByIdOrNameOrIdentifier(`${identifier}`);
        if (account === undefined) {
            throw new NotFoundException('Account not found')
        }

        const reportData = await this.prepareReportDataForAccount(account)

        await this.sendEmail(account, reportData)


        return true
    }

    private async sendReportToAccount(account: Account): Promise<boolean> {
        try {
            const reportData = await this.prepareReportDataForAccount(account)
            await this.sendEmail(account, reportData)
        } catch (e) {
            this.logger.error({
                message: `Failed to send report to account: ${account.identifier}. Email: ${account.primaryContact}.`,
                detail: e,
                fn: this.sendReportToAccount.name,
            })
        }

        return true
    }

    private async sendEmail(account: Account, reportData: AccountReportData): Promise<boolean> {
        let signature = '<br/>'
        signature += "בברכת נסיעה בטוחה,"
        signature += '<br/>'
        signature += 'צוות Road Protect'
        signature = '<div style="direction: rtl; text-align: right; font-family: Arial, sans-serif;">' + signature + '</div>'



        const context: AccountReportEmail = {
            name: reportData.clientName,
            report: reportData,
            customSignature: signature
        }

        let subject = 'סטטוס שבועי עבור {{client_name}} לתאריך {{actual_date}}'
        subject = subject.replace('{{actual_date}}', reportData.currentDate)
        subject = subject.replace('{{client_name}}', reportData.clientName)

        // const to = account.primaryContact
        const to = 'salman@roadprotect.co.il'
        await this.emailService.sendEmail({
            template: EmailTemplate.AccountReport,
            to: to,
            from: 'support@roadprotect.co.il',
            subject: subject,
            context: context,
        });

        return true
    }

    private async prepareReportDataForAccount(account: Account): Promise<AccountReportData> {
        let report = new AccountReportData()

        report.clientName = account.name
        report.currentDate = moment(moment.now()).format('DD/MM/yyyy')

        report.infringements = await this.prepareInfringementData(account)
        report.issuers = await this.prepareIssuersData(account)
        report.vehicles = await this.prepareVehiclesData(account)
        report.redirections = await this.prepareRedirectionsData(account)

        return report
    }

    /**
     * REDIRECTIONS SECTION
     */

    private async prepareRedirectionsData(account: Account): Promise<RedirectionsData> {
        const redirectionsData = new RedirectionsData()

        const totalRedirections = await this.findTotalRedirections(account)
        redirectionsData.totalFinishedRedirectionsCount = "0"
        redirectionsData.totalInProgressRedirectionsCount = "0"

        totalRedirections.forEach((data) => {
            if (data.status === NominationStatus.InRedirectionProcess) {
                redirectionsData.totalInProgressRedirectionsCount = data.totalCount
            } else if (data.status === NominationStatus.RedirectionCompleted ||
                       data.status === NominationStatus.Closed) {
                redirectionsData.totalFinishedRedirectionsCount = data.totalCount
            }
        })

        redirectionsData.totalFinishedRedirectionsCount = this.formatNumber(redirectionsData.totalFinishedRedirectionsCount)
        redirectionsData.totalInProgressRedirectionsCount = this.formatNumber(redirectionsData.totalInProgressRedirectionsCount)

        let total = 0
        for (let redirection of totalRedirections) {
            const val = parseInt(redirection.totalCount)
            if (!isNaN(val)) {
                total += val
            }
        }

        redirectionsData.totalRedirectionsCount = this.formatNumber(total)

        return redirectionsData
    }

    private async findTotalRedirections(account: Account): Promise<{totalCount: string, status: string}[]> {

        const infringementBaseQuery = this.accountReportingQueryService.generateInfringementBaseQuery(account, undefined);
        let data = await infringementBaseQuery
            .select(['count(*) AS "totalCount"', 'nomination.status AS "status"'])
            .andWhere('nomination."status" IN (:...statuses)', {
                statuses: [NominationStatus.InRedirectionProcess, NominationStatus.RedirectionCompleted, NominationStatus.Closed]
            })
            .andWhere('nomination."redirectionLetterSendDate" IS NOT NULL')
            .groupBy('nomination."status"')
            .getRawMany<{ totalCount: string; status: string }>();

        return data
    }

    /**
     * VEHICLES SECTION
     */

    private async prepareVehiclesData(account: Account): Promise<VehiclesData> {
        let vehiclesData = new VehiclesData()

        vehiclesData.allVehiclesLink = this.appRoutesProviderService.getViewAccountVehiclesRoute()
        // vehiclesData.vehiclesWithValidContractLink = this.appRoutesProviderService.getViewAccountVehiclesRoute()

        const totalVehicles = await this.findTotalVehicles(account)
        vehiclesData.totalVehiclesCount = this.formatNumber(totalVehicles.totalCount)

        const totalLeasedVehicles = await this.findTotalLeasedVehiclesWithValidContract(account)
        vehiclesData.totalLeasedVehiclesCount = this.formatNumber(totalLeasedVehicles.totalCount)

        const totalLeasedExpiredVehicles = await this.findTotalLeasedVehiclesWithExpiredContract(account)
        vehiclesData.totalLeasedExpiredVehiclesCount = this.formatNumber(totalLeasedExpiredVehicles.totalCount)

        return vehiclesData

    }

    private async findTotalVehicles(account: Account): Promise<{totalCount: string}> {
        const all = await this.accountReportingQueryService
            .generateVehicleBaseQuery(account, VehicleEndpoints.All)
            .select(['count(DISTINCT vehicle.registration) AS "totalCount"'])
            .getRawOne<{ totalCount: string }>();

        return all
    }

    private async findTotalLeasedVehiclesWithValidContract(account: Account): Promise<{totalCount: string}> {
        const all = await this.accountReportingQueryService
            .generateVehicleBaseQuery(account, VehicleEndpoints.Leasing)
            .andWhere(`"currentLeaseContract"."status" IN (:...statuses)`, {
                statuses: [ContractStatus.Valid, ContractStatus.ExpiringSoon],
            })
            .select(['count(DISTINCT vehicle.registration) AS "totalCount"'])
            .getRawOne<{ totalCount: string }>();

        return all
    }

    private async findTotalLeasedVehiclesWithExpiredContract(account: Account): Promise<{totalCount: string}> {
        const all = await this.accountReportingQueryService
            .generateVehicleBaseQuery(account, VehicleEndpoints.Leasing)
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere(`"currentLeaseContract"."status" IN (:...statuses)`, {
                        statuses: [ContractStatus.Expired],
                    });
                    qb.orWhere('"currentLeaseContract"."contractId" IS NULL')
                }),
            )
            .select(['count(DISTINCT vehicle.registration) AS "totalCount"'])
            .getRawOne<{ totalCount: string }>();

        return all
    }

    /**
     * ISSUERS SECTION
     */
    private async prepareIssuersData(account: Account): Promise<IssuersData> {
        let issuersData = new IssuersData()

        const totalIssuers = await this.findTotalIssuers(account)
        issuersData.totalIssuersCount = this.formatNumber(totalIssuers.totalIssuers)

        const policeIssuer = await this.findPoliceInfringements(account)
        const topIssuerInfringements = await this.findTopIssuers(account)

        issuersData.policeIssuer = !!policeIssuer ? new TopIssuer(
            policeIssuer.issuerName,
            this.formatNumber(policeIssuer.totalInfringements)
        ) : null
        issuersData.topIssuers = topIssuerInfringements.map( (issuer) => {
            return new TopIssuer(issuer.issuerName, this.formatNumber(issuer.totalInfringements))
        }).filter( (issuer) => issuer.name !== policeIssuer?.issuerName )


        return issuersData
    }

    private async findTotalIssuers(account: Account): Promise<{totalIssuers: string}> {
        const infringementBaseQuery = this.accountReportingQueryService.generateInfringementBaseQuery(account, undefined);
        const totalIssuers = await infringementBaseQuery
            .select(['count(DISTINCT(issuer."name")) AS "totalIssuers"'])
            .getRawOne<{ totalIssuers: string}>();

        return totalIssuers;
    }

    private async findTopIssuers(account: Account): Promise<{issuerName: string, totalInfringements: string}[]> {
        const infringementBaseQuery = this.accountReportingQueryService.generateInfringementBaseQuery(account, undefined);
        const totalPoliceInfringements = await infringementBaseQuery
            .select([
                'issuer."name" AS "issuerName"',
                'count(*) AS "totalInfringements"'
            ])
            .groupBy(`issuer."name"`)
            .orderBy('"totalInfringements"', "DESC")
            .limit(3)
            .getRawMany<{issuerName: string, totalInfringements: string}>();

        return totalPoliceInfringements
    }

    private async findPoliceInfringements(account: Account): Promise<{issuerName: string, totalInfringements: string}> {
        const infringementBaseQuery = this.accountReportingQueryService.generateInfringementBaseQuery(account, undefined);
        const totalPoliceInfringements = await infringementBaseQuery
            .select(['issuer."name" as "issuerName"', 'count(*) AS "totalInfringements"'])
            .andWhere(`issuer."integrationDetails"->>'verificationProvider' = :provider`, {
                provider: InfringementVerificationProvider.Police,
            })
            .groupBy(`issuer."name"`)
            .getRawOne<{ issuerName: string, totalInfringements: string}>();

        return totalPoliceInfringements
    }

    /**
     * INFRINGEMENTS SECTION
     */
    private async prepareInfringementData(account: Account): Promise<InfringementsData> {
        let infringementsData = new InfringementsData()

        infringementsData.allInfringementsLink = this.appRoutesProviderService.getViewAccountInfringementsRoute()
        infringementsData.outstandingSoonInfringementsLink = this.appRoutesProviderService.getViewAccountInfringementsRoute(
            [InfringementStatus.Due, InfringementStatus.ApprovedForPayment],
            {
                from: moment(moment.now()).toISOString(),
                to: moment(moment.now()).add(Config.get.infringement.defaultPaymentDays, 'days').toISOString()
            }
        )

        infringementsData.outstandingInfringementsLink = this.appRoutesProviderService.getViewAccountInfringementsRoute(
            [InfringementStatus.Outstanding]
        )

        const totalCountAndCost = await this.findTotalCountAndCostInfringements(account)
        infringementsData.totalInfringementsCount = this.formatNumber(totalCountAndCost.totalCount)
        // HERE
        infringementsData.totalInfringementsCost = this.formatPrice(totalCountAndCost.totalCost)

        const totalPaidInfringements = await this.findTotalPaidInfringements(account)
        infringementsData.totalPaidInfringements = this.formatNumber(totalPaidInfringements.totalCount)

        const totalOutstandingSoon = await this.findOutstandingSoonInfringements(account)
        infringementsData.totalOutstandingSoon = this.formatNumber(totalOutstandingSoon.outstandingSoon)

        const totalOutstanding = await this.findOutstandingInfringements(account)
        infringementsData.totalOutstanding = this.formatNumber(totalOutstanding.outstanding)

        return infringementsData
    }

    private async findTotalCountAndCostInfringements(account: Account): Promise<{totalCount: string, totalCost: string}> {
        const infringementBaseQuery = this.accountReportingQueryService.generateInfringementBaseQuery(account, undefined);
        let data = await infringementBaseQuery
            .select([
                'count(*) AS "totalCount"',
                'sum(infringement."amountDue") as "amountDue"',
                'sum(infringement."penaltyAmount") as "penaltyAmount"',
                'sum(infringement."totalPayments") as "totalPayments"'
            ])
            .getRawOne<{ totalCount: string; amountDue: string, penaltyAmount: string, totalPayments: string }>();

        let amountDue = new BigNumber(data.amountDue)
        let penaltyAmount = new BigNumber(data.penaltyAmount)
        let totalPayments = new BigNumber(data.totalPayments)

        let totalCost = new BigNumber(0)
        if (!amountDue.isNaN()) {
            totalCost = totalCost.plus(amountDue)
        }

        if (!penaltyAmount.isNaN()) {
            totalCost = totalCost.plus(penaltyAmount)
        }

        if (!totalPayments.isNaN()) {
            totalCost = totalCost.plus(totalPayments)
        }

        return {totalCount: data.totalCount, totalCost: totalCost.toFixed(2)}
    }

    private async findTotalPaidInfringements(account: Account): Promise<{totalCount: string}> {
        const infringementBaseQuery = this.accountReportingQueryService.generateInfringementBaseQuery(account, undefined);

        return await infringementBaseQuery
            .andWhere('infringement.status = :status', {
                status: InfringementStatus.Paid,
            })
            .select(['count(*) as "totalCount"'])
            .getRawOne<{ totalCount: string }>();
    }

    async findOutstandingSoonInfringements(account: Account): Promise<{outstandingSoon: string}> {
        // Generate base queries
        const infringementBaseQuery = this.accountReportingQueryService.generateInfringementBaseQueryNoDates(account);
        return await infringementBaseQuery
            .andWhere('infringement.status in (:...statuses)', {
                statuses: [InfringementStatus.Due, InfringementStatus.ApprovedForPayment],
            })
            .andWhere('infringement.latestPaymentDate BETWEEN :startDate AND :endDate', {
                startDate: moment(moment.now()).toISOString(),
                endDate: moment(moment.now()).add(Config.get.infringement.defaultPaymentDays, 'days').toISOString(),
            })
            .select(['count(*) as "outstandingSoon"'])
            .getRawOne<{ outstandingSoon: string }>();


    }

    async findOutstandingInfringements(account: Account): Promise<{outstanding: string}> {
        // Generate base queries
        const infringementBaseQuery = this.accountReportingQueryService.generateInfringementBaseQueryNoDates(account);
        return await infringementBaseQuery
            .andWhere('infringement.status = :status', {
                status: InfringementStatus.Outstanding,
            })
            .select(['count(*) as "outstanding"'])
            .getRawOne<{ outstanding: string }>();
    }

    // Utils

    private formatPrice(number: any): string {
        if (typeof number === 'string' ) {
            return this.priceFormatter.format(parseFloat(number))
        } else if (typeof number === 'number') {
            return this.priceFormatter.format(number)
        } else {
            return number
        }
    }

    private formatNumber(number: any): string {
        if (typeof number === 'string' ) {
            return this.numberFormatter.format(parseFloat(number))
        } else if (typeof number === 'number') {
            return this.numberFormatter.format(number)
        } else {
            return number
        }
    }
}
