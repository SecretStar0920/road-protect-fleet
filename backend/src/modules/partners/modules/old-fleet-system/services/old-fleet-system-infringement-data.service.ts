import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { BadRequestException, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { Logger } from '@logger';
import { get, isNil } from 'lodash';
import { Client, Infringement, Integration, RawInfringement } from '@entities';
import { CreateRawInfringementService } from '@modules/raw-infringement/services/create-raw-infringement.service';
import { Config } from '@config/config';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { FeatureFlagHelper } from '@modules/shared/modules/feature-flag/helpers/feature-flag.helper';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { httpClient, jsonToFormData } from '@modules/shared/http-client/http-client';

export class OldFleetFineFilters {
    @IsOptional()
    @IsString()
    vehicleRegistration?: string;
    @IsOptional()
    @IsString()
    sinceVerificationDate?: string;
    @IsOptional()
    @IsNumber()
    page?: number;
    @IsOptional()
    @IsString()
    noticeNumber?: string;
}

export interface IFinesOutputFromOldIsraelFleet {
    records: number;
    page: number;
    total: number;
    fine_amount_total: number;
    fine_debit_total: number;
    fine_amount_payed_total: number;
    rows: IOneFineFromOldIsraelFleet[];
}

export interface IOneFineFromOldIsraelFleet {
    fine_seq: string;
    fine_id: string;
    fine_veh_id: string;
    fine_end_cust_id: string;
    cust_name: string;
    fine_action_date: string;
    fine_verify_date: string;
    fine_pay_due_date: string;
    fine_amount: string;
    fine_debit: string;
    fine_amount_payed: string;
    fine_status: string;
    fine_trx_msg: string;
    city_name: string;
    fine_street: string;
    fine_branch: string;
    fine_comments: string;
    fine_import_date: string;
    fine_trx_id: string;
    fine_status_date: string;
    fine_transfer_date: string;
    fine_driver: string;
    fine_driver_charge: string;
}

@Injectable()
export class OldFleetSystemInfringementDataService implements OnModuleInit {
    private authenticationToken: string;
    private client: Client;
    oldIsraelFleetUrl: string = 'http://63.250.61.47/oneprotect/server/datalayer/ccc_controler.php';

    constructor(
        private logger: Logger,
        private createRawInfringementService: CreateRawInfringementService,
        private integrationRequestLogger: IntegrationRequestLogger,
    ) {}

    async onModuleInit() {
        if (!(await FeatureFlagHelper.isEnabled({ title: 'old-fleet-login', defaultEnabled: false }))) {
            return;
        }
        await this.loginToOldIsraelFleet();
        this.client = await Client.findOne({ name: 'old-israel-fleet' });

        if (isNil(this.client)) {
            this.logger.error({ message: 'Could not find old road protect client', fn: this.constructor.name });
        }
    }

    getAuthenticationToken(): string {
        return this.authenticationToken;
    }

    // Scheduled to log in everyday at midnight
    // @Cron('0 0 0 * * * ')
    public async loginToOldIsraelFleet(): Promise<string> {
        try {
            const response: any = await httpClient.post(this.oldIsraelFleetUrl, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: jsonToFormData({
                    username: Config.get.oldFleetSystemConfig.username,
                    user_password: Config.get.oldFleetSystemConfig.password,
                    ccc_function: 'f_login_query',
                }),
                responseType: 'json',
            });
            if (!response.user_token) {
                throw new InternalServerErrorException({ message: ERROR_CODES.E093_LoggedInNoToken.message(), details: response });
            }
            this.logger.log({ message: 'Successfully logged in to old road protect', fn: this.loginToOldIsraelFleet.name });
            this.authenticationToken = get(response, 'user_token', null);
            return this.authenticationToken;
        } catch (e) {
            this.logger.error({
                message: 'Error logging in to old road protect',
                detail: {
                    error: e.message,
                    stack: e.stack,
                },
                fn: this.loginToOldIsraelFleet.name,
            });
            return e;
        }
    }

    async syncAllFines(): Promise<{ successful: RawInfringement[]; failed: IOneFineFromOldIsraelFleet[] }> {
        const filter: OldFleetFineFilters = {};
        return this.syncFilteredFines(filter);
    }

    async syncFilteredFines(
        filters: OldFleetFineFilters,
    ): Promise<{ successful: RawInfringement[]; failed: IOneFineFromOldIsraelFleet[] }> {
        let url = `${this.oldIsraelFleetUrl}?user_token=${this.authenticationToken}&ccc_function=f_fine_search_query&rows=100000`;
        if (!isNil(filters.vehicleRegistration)) {
            url = `${url}&fine_veh_id=${filters.vehicleRegistration}`;
        }

        if (!isNil(filters.sinceVerificationDate)) {
            url = `${url}&fine_status_date_from=${filters.sinceVerificationDate}`;
        }

        if (!isNil(filters.page)) {
            url = `${url}&page=${filters.page}`;
        }

        if (!isNil(filters.noticeNumber)) {
            url = `${url}&fine_id=${filters.noticeNumber}`;
        }

        const output: IFinesOutputFromOldIsraelFleet = await this.requestToOldIsraelFleet(url);
        const fines: IOneFineFromOldIsraelFleet[] = get(output, 'rows', []);

        if (!fines) {
            return { successful: [], failed: [] };
        }

        const successful: RawInfringement[] = [];
        const failed: IOneFineFromOldIsraelFleet[] = [];
        for (const fine of fines) {
            let result: any;
            try {
                result = await this.createRawInfringementService.createRawInfringement(fine, this.client);
                successful.push(result.raw);
            } catch (e) {
                failed.push(fine);
            }
        }

        return { successful, failed };
    }

    async syncInfringementById(infringementId: number): Promise<{ raw: RawInfringement; infringement?: Infringement }> {
        const infringement = await Infringement.findWithMinimalRelations()
            .addSelect(['issuer.code'])
            .andWhere(`infringement.infringementId = :id`, { id: infringementId })
            .getOne();

        if (isNil(infringement)) {
            throw new BadRequestException({
                message: ERROR_CODES.E037_CouldNotFindInfringement.message({ infringementId }),
                context: { infringementId },
            });
        }

        // Map our notice number to their primary key
        const fineSequence = this.determineFineSequence(infringement);
        const result = await this.rawInfringementFromFineSequence(fineSequence);
        return { raw: result.raw, infringement: result.infringement || infringement };
    }

    private async rawInfringementFromFineSequence(fineSequence: string): Promise<{ raw: RawInfringement; infringement?: Infringement }> {
        const url = `${this.oldIsraelFleetUrl}?user_token=${this.authenticationToken}&ccc_function=fine_by_pk&fine_seq=${fineSequence}`;
        const fine: IOneFineFromOldIsraelFleet = await this.requestToOldIsraelFleet(url);
        const result = await this.createRawInfringementService.createRawInfringement(fine, this.client);

        return { raw: result.raw, infringement: result.infringement || undefined };
    }

    async verifyBatchInfringements(infringementIds: number[]): Promise<{ raw: RawInfringement; infringement: Infringement }[]> {
        let url = `${this.oldIsraelFleetUrl}?user_token=${this.authenticationToken}&ccc_function=fine_verify`;
        let noInfringementsToBeValidated: boolean = true;

        for (const infringementId of infringementIds) {
            const infringement = await Infringement.findWithMinimalRelations()
                .addSelect(['issuer.provider'])
                .andWhere(`infringement.infringementId = :id`, { id: infringementId })
                .getOne();

            if (isNil(infringement)) {
                throw new BadRequestException({
                    message: ERROR_CODES.E037_CouldNotFindInfringement.message({ infringementId }),
                    context: { infringementId },
                });
            }

            const provider = get(infringement, 'issuer.provider');
            if (!(provider === 'ATG' || provider === 'mil’on')) {
                this.logger.debug({
                    message: 'Infringement provider does not support verification',
                    detail: { infringementId },
                    fn: this.verifyBatchInfringements.name,
                });
            } else {
                const fineSequence = this.determineFineSequence(infringement);
                noInfringementsToBeValidated = false;
                url = `${url}&selectedFines[]=${fineSequence}`;
            }
        }

        if (noInfringementsToBeValidated) {
            this.logger.debug({
                message: 'None of the infringements specified can be verified',
                detail: { infringementIds },
                fn: this.verifyBatchInfringements.name,
            });
            return;
        }

        const results = [];
        const verifiedFines = await this.requestToOldIsraelFleet(url);
        for (const fine of verifiedFines.verified_records) {
            if (!fine.error) {
                const result = await this.rawInfringementFromFineSequence(fine.fine_seq);
                results.push({ raw: result.raw, infringement: result.infringement });
            }
        }

        return results;
    }

    // Passing calledByFunction for logging
    private async requestToOldIsraelFleet(url: string): Promise<any> {
        try {
            this.logger.debug({
                message: 'Making a request to the old fleet system',
                detail: { url },
                fn: this.requestToOldIsraelFleet.name,
            });

            const response: any = await httpClient.get(url).json();

            // Errors from old road protect don't throw an exception but returns an object with an error key
            if (response.error) {
                this.logger.error({
                    message: 'An error occurred when making request to old road protect',
                    detail: response,
                    fn: this.requestToOldIsraelFleet.name,
                });
                await this.integrationRequestLogger.logFailed(Integration.OldFleetInfringementData, { url }, response);
                throw new BadRequestException(ERROR_CODES.E094_ErrorFromOldFleets.message({ response }));
            }
            this.logger.log({ message: 'Successfully made request to old road protect', fn: this.requestToOldIsraelFleet.name });
            await this.integrationRequestLogger.logSuccessful(Integration.OldFleetInfringementData, { url }, response);
            return response;
        } catch (e) {
            if (e instanceof BadRequestException) {
                throw e;
            }
            await this.integrationRequestLogger.logFailed(Integration.OldFleetInfringementData, { url }, e);
            throw new InternalServerErrorException({ message: ERROR_CODES.E095_ErrorRequestingFromOldFleets.message(), detail: e });
        }
    }

    private determineFineSequence(infringement) {
        const oldFleetCityCode = 10000 + Number(get(infringement, 'issuer.code'));
        return `${oldFleetCityCode}${infringement.noticeNumber}`;
    }
}
