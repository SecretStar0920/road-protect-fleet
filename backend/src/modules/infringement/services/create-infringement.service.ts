import { Config } from '@config/config';
import {
    Document,
    Infringement,
    INFRINGEMENT_CONSTRAINTS,
    InfringementCreationMethod,
    InfringementSystemStatus,
    Issuer,
    Log,
    LogPriority,
    LogType,
    RawLocationParserHelper,
    User,
    Vehicle,
} from '@entities';
import { Logger, LoggerClass, LoggerMethod } from '@logger';
import { CreateInfringementDto, CreateInfringementSpreadsheetDto } from '@modules/infringement/controllers/create-infringement.dto';
import { StatusUpdateSources } from '@modules/infringement/helpers/status-updater/status-update-sources.enum';
import { StatusUpdater } from '@modules/infringement/helpers/status-updater/status-updater';
import { CreateLocationDetailedDto, CreateLocationSingleDto } from '@modules/location/controllers/create-location-detailed.dto';
import { CreateLocationService } from '@modules/location/services/create-location.service';
import { NominationDto } from '@modules/nomination/dtos/nomination.dto';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';
import { LinkingService } from '@modules/shared/services/linking.service';
import { CreateVehicleService } from '@modules/vehicle/services/create-vehicle.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { isEmpty, isNil, merge, omit } from 'lodash';
import * as moment from 'moment';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { StandardNominationRulesService } from '@modules/nomination/services/standard-nomination-rules.service';
import { ExternalPaymentService } from '@modules/payment/services/external-payment.service';
import { StandardInfringementRulesService } from '@modules/infringement/services/standard-infringement-rules.service';
import { UpdateInfringementOriginalAmountService } from '@modules/infringement/services/update-infringement-original-amount.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { AsyncStorageHelper } from '@middleware/async-local-storage.middleware';

@Injectable()
@LoggerClass()
/**
 * Current Process: https://drive.google.com/file/d/1y6Y59tV4-i0YO8PbbfwI0R4k4OK7mf_Q/view?usp=sharing
 */
export class CreateInfringementService {
    constructor(
        private logger: Logger,
        private createLocationService: CreateLocationService,
        private linkingService: LinkingService,
        private createVehicleService: CreateVehicleService,
        private standardNominationRulesService: StandardNominationRulesService,
        private externalPaymentService: ExternalPaymentService,
        private updateInfringementOriginalAmountService: UpdateInfringementOriginalAmountService,
        private standardInfringementRulesService: StandardInfringementRulesService,
    ) {}

    @Transactional()
    async createInfringementFromSpreadsheet(dto: CreateInfringementSpreadsheetDto): Promise<Infringement> {
        const locationSingleDto: CreateLocationSingleDto = plainToClass(CreateLocationSingleDto, dto);
        const mappedLocationDto: CreateLocationDetailedDto = RawLocationParserHelper.parseCreateDto(locationSingleDto);
        const createInfringementDto: CreateInfringementDto = merge(dto, mappedLocationDto);
        return this.createInfringement(createInfringementDto, {}, InfringementCreationMethod.ExcelUpload);
    }

    @Transactional()
    @LoggerMethod()
    async createInfringement(
        dto: CreateInfringementDto,
        nominationDto: NominationDto = {},
        creationMethod: InfringementCreationMethod = InfringementCreationMethod.Unknown,
    ): Promise<Infringement> {
        const statusUpdater = StatusUpdater.create().setSource(StatusUpdateSources.CreateInfringement).setDto(dto);

        // Check if infringement already exists
        const foundInfringement = await Infringement.findByNoticeNumberAndIssuer(dto.noticeNumber, dto.issuer).getOne();
        if (!isNil(foundInfringement)) {
            throw new BadRequestException({ message: ERROR_CODES.E131_InfringementWithNoticeNumberExistsForIssuer.message() });
        }

        // Auto set latest payment date to 90 days from offenceDate if it is not provided
        if (isNil(dto.latestPaymentDate) || isEmpty(dto.latestPaymentDate) || Number.parseInt(dto.latestPaymentDate)==0 ) {
            dto.latestPaymentDate = moment(dto.offenceDate).add(Config.get.infringement.defaultPaymentDays, 'days').toISOString();
        }

        // Auto set original amount if it was not provided to be equal to amountDue.
        if ((isNil(dto.originalAmount) && !isNil(dto.amountDue)) || Number(dto.originalAmount || 0) === 0) {
            dto.originalAmount = dto.amountDue;
        }

        // Create base infringement
        let infringement = Infringement.create(omit(dto, ['issuer', 'vehicle']));
        

        infringement.externalChangeDate = dto.isExternal ? moment().toISOString() : infringement.externalChangeDate;

        // Check and set relations

        // ISSUER
        infringement.issuer = await this.checkIssuer(dto.issuer);

        // VEHICLE
        const { vehicle, vehicleExisted } = await this.findOrCreateVehicle(dto.vehicle);
        infringement.vehicle = vehicle;
        if (!vehicleExisted) {
            // FIXME: this is gross and not maintainable, at a later stage if a contract is added or vehicle is updated this needs to be updated too
            // Update the infringement system status to "Missing Vehicle" if there wasn't actually a vehicle we could link to
            infringement.systemStatus = InfringementSystemStatus.MissingVehicle;
            await infringement.save();
        }

        // LOCATION
        const locationDto = await this.checkLocation(dto);
        if (locationDto) {
            // Since we cascade the creation of the location, I'm just going to
            // add the entity model here but I won't save it yet.
            infringement.location = await this.createLocationService.createPhysicalLocation(locationDto);
        }

        // DOCUMENT
        infringement.document = dto.documentId ? await Document.findOne(dto.documentId) : undefined;

        // ORIGINAL AMOUNT
        infringement.originalAmount = await this.updateInfringementOriginalAmountService.updateOriginalAmount(infringement);

        // Save to database
        try {
            infringement = await infringement.save();
        } catch (e) {
            databaseExceptionHelper(e, INFRINGEMENT_CONSTRAINTS, 'Failed to create infringement, please contact the developers.');
        }

        await Log.createAndSave({ infringement, vehicle, priority: LogPriority.High, type: LogType.Created, message: 'Infringement' });
        statusUpdater.setFinalInfringement(infringement);
        // NB: set links for contract and nomination, this is where all the important linking is done (it's very nested so keep diving deep)
        await this.linkingService.linkInfringementContractAndResolveNomination(infringement, statusUpdater, nominationDto);

        infringement.nomination = infringement.nomination || statusUpdater.getLatestNomination();
        infringement.nomination = await this.standardNominationRulesService.applyRules(infringement, infringement.nomination);
        await this.standardInfringementRulesService.applyRules(infringement);

        statusUpdater.resolveStatusUpdates().throwIfInvalidStatusTransition();
        await statusUpdater.persist();
        statusUpdater.logInfo();

        // Re-find the infringement after the linking process, since a lot may have changed
        const finalInfringement = await Infringement.findWithMinimalRelations()
            .andWhere('infringement.infringementId = :id', { id: infringement.infringementId })
            .getOne();
        // cancel insertion of external payment
        // await this.externalPaymentService.upsertUsingNomination(finalInfringement, nominationDto);

        // CREATION
        await this.addCreationUser(finalInfringement, creationMethod);
        return finalInfringement;
    }

    @LoggerMethod()
    private async findOrCreateVehicle(vehicle: string): Promise<{ vehicle: Vehicle; vehicleExisted: boolean }> {
        const foundVehicle = await Vehicle.findOneByRegistrationOrId(vehicle);
        if (isNil(foundVehicle)) {
            // Disabled due to RP-563
            this.logger.warnV2({ message: 'No vehicle exists on the system for this infringement, creating the vehicle', context: this });
            const newVehicle = await this.createVehicleService.createVehicle(
                { registration: vehicle, manufacturer: Config.get.vehicle.defaultManufacturer },
                false,
            );
            return { vehicle: newVehicle, vehicleExisted: false };
        }
        return { vehicle: foundVehicle, vehicleExisted: true };
    }

    @LoggerMethod()
    private async checkIssuer(issuer: string | number): Promise<Issuer> {
        const foundIssuer = await Issuer.findByNameOrCode(issuer);
        if (isNil(foundIssuer)) {
            throw new BadRequestException({ message: ERROR_CODES.E132_IssuerNotFound.message({ issuerNameOrCode: issuer }) });
        }
        return foundIssuer;
    }

    @LoggerMethod()
    private async addCreationUser(
        infringement: Infringement,
        creationMethod: InfringementCreationMethod = InfringementCreationMethod.Unknown,
    ) {
        infringement.creationMethod = creationMethod;
        // Add user if can
        if (creationMethod === InfringementCreationMethod.User || creationMethod === InfringementCreationMethod.ExcelUpload) {
            try {
                const store = AsyncStorageHelper.getStoreSafe();
                const userIdentity = store.identity();
                this.logger.debug({
                    message: 'Found user for infringement',
                    detail: { creationMethod, user: userIdentity.user.userId },
                    fn: this.addCreationUser.name,
                });
                infringement.user = userIdentity.user;
                await infringement.save();
            } catch (error) {
                this.logger.debug({
                    message: 'Could not add user to infringement',
                    detail: error,
                    fn: this.addCreationUser.name,
                });
            }
        }
    }

    @LoggerMethod()
    private async checkLocation(dto: CreateInfringementDto): Promise<CreateLocationDetailedDto> {
        const createLocationDto: CreateLocationDetailedDto = plainToClass(CreateLocationDetailedDto, dto);
        try {
            await validate(createLocationDto);
        } catch (e) {
            this.logger.warn({ message: `Failed to validate the given location`, fn: this.checkLocation.name, detail: createLocationDto });
            return null;
        }
        if (isNil(createLocationDto.streetName)) {
            return null;
        }

        return createLocationDto;
    }
}
