import { Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from '@logger';
import { GoogleLocationService } from '@modules/location/services/google-location.service';
import { PhysicalLocation } from '@entities';
import { get, isEmpty } from 'lodash';
import { Cron } from '@nestjs/schedule';
import { FeatureFlagHelper } from '@modules/shared/modules/feature-flag/helpers/feature-flag.helper';

@Injectable()
export class LocationScheduleService implements OnModuleInit {
    static isUpdating: boolean = false;

    constructor(private logger: Logger, private googleLocationService: GoogleLocationService) {}

    async onModuleInit() {}

    /**
     * This has a cost associated with it and so we cannot perform the query on large scale
     * It could be done on a request by request basis, i.e, when the user requests to see it on a map
     */
    @Cron('*/5 * * * * ') // every 5 minutes
    async verifyAccountLocationsWithGoogleGeocoding() {
        if (!(await FeatureFlagHelper.isEnabled({ title: 'add-missing-google-locations', defaultEnabled: false }))) {
            return;
        }

        const locationsToUpdate = await PhysicalLocation.createQueryBuilder('location')
            .innerJoinAndSelect('location.accountPhysical', 'account')
            .andWhere('location.hasGoogleResult = FALSE')
            .getMany();

        if (isEmpty(locationsToUpdate) || LocationScheduleService.isUpdating) {
            return;
        }

        this.logger.debug({
            message: `Location Scheduler: found ${locationsToUpdate.length} locations to update with Google API`,
            detail: null,
            fn: this.verifyAccountLocationsWithGoogleGeocoding.name,
        });
        // For each location
        LocationScheduleService.isUpdating = true;
        for (const location of locationsToUpdate) {
            await this.updatePhysicalLocationWithGoogleResult(location);
        }
        LocationScheduleService.isUpdating = false;
    }

    async updatePhysicalLocationWithGoogleResult(location: PhysicalLocation) {
        try {
            const result = await this.googleLocationService.geocode(location.address);
            this.logger.log({ message: 'Google location result', detail: result, fn: this.verifyAccountLocationsWithGoogleGeocoding.name });
            location.hasGoogleResult = true;
            location.googleLocation = result;

            if (result.status !== 'OK') {
                this.logger.error({
                    message: 'Google location request unsuccessful ',
                    detail: { result, location },
                    fn: this.verifyAccountLocationsWithGoogleGeocoding.name,
                });
            } else if (!isEmpty(result)) {
                location.formattedAddress = get(result, 'results[0].formatted_address');
                this.logger.log({
                    message: 'Formatted Address set to',
                    detail: location.formattedAddress,
                    fn: this.verifyAccountLocationsWithGoogleGeocoding.name,
                });
            }
            await location.save();
        } catch (e) {
            this.logger.error({
                message: 'Failed to add missing google location for location: ',
                detail: { location, e },
                fn: this.verifyAccountLocationsWithGoogleGeocoding.name,
            });
        }
    }
}
