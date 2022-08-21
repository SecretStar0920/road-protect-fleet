import { Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { Logger } from '@logger';
import { Account, Driver, Issuer, Location, PhysicalLocation, PostalLocation, Street } from '@entities';
import { safeSocket } from '@modules/shared/decorators/user-socket.decorator';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export class RedirectionAddressDetails {
    streetName: string = null;
    streetNumber: string = null;
    streetCode: string = null;
    zipCode: string = null;
    issuer: Issuer = null;

    // Status
    valid: boolean = true;
    message: string = 'Valid redirection details';

    location: Location;
}

@Injectable()
export class ExtractRedirectionAddressDetailsService {
    constructor(private logger: Logger) {}

    public async extractRedirectionAddressDetails(
        account: Account | null,
        socket: DistributedWebsocket = safeSocket as any,
    ): Promise<RedirectionAddressDetails> {
        // tslint:disable-next-line:prefer-const
        let [userPostalAddress, userPhysicalAddress, details] = await this.findAddresses(account);
        const hasPostalAddress = !isNil(userPostalAddress);
        const hasPhysicalAddress = !isNil(userPhysicalAddress);

        if (hasPostalAddress) {
            details = await this.updateUsingPhysicalAddress(details, userPhysicalAddress);
        } else if (hasPhysicalAddress) {
            details = await this.updateUsingPhysicalAddress(details, userPhysicalAddress);
        } else {
            details.valid = false;
            details.message = ERROR_CODES.E113_TargetAccountMissingAddressInformation.message();
            return details;
        }
        details = await this.checkCity(details);
        return details;
    }

    public async extractRedirectionDriverAddressDetails(
        driver: Driver | null,
        socket: DistributedWebsocket = safeSocket as any,
    ): Promise<RedirectionAddressDetails> {
        // tslint:disable-next-line:prefer-const
        let [driverPostalAddress, driverPhysicalAddress, details] = await this.findDriverAddresses(driver);
        const hasPostalAddress = !isNil(driverPostalAddress);
        const hasPhysicalAddress = !isNil(driverPhysicalAddress);

        if (hasPhysicalAddress) {
            details = await this.updateUsingPhysicalAddress(details, driverPhysicalAddress);
        } else if (hasPostalAddress) {
            details = await this.updateUsingPostalAddress(details, driverPostalAddress);
        } else {
            details.valid = false;
            details.message = ERROR_CODES.E165_TargetAccountMissingAddressInformation.message();
            return details;
        }
        details = await this.checkCity(details);
        return details;
    }

    public async extractRedirectionPhysicalAddressDetails(
        account: Account | null,
        socket: DistributedWebsocket = safeSocket as any,
    ): Promise<RedirectionAddressDetails> {
        // tslint:disable-next-line:prefer-const
        let [userPostalAddress, userPhysicalAddress, details] = await this.findAddresses(account);

        const hasPostalAddress = !isNil(userPostalAddress);
        const hasPhysicalAddress = !isNil(userPhysicalAddress);

        if (hasPhysicalAddress) {
            details = await this.updateUsingPhysicalAddress(details, userPhysicalAddress);
        } else if (hasPostalAddress) {
            details = await this.updateUsingPostalAddress(details, userPostalAddress);
        } else {
            details.valid = false;
            details.message = ERROR_CODES.E113_TargetAccountMissingAddressInformation.message();
            return details;
        }
        details = await this.checkCity(details);
        return details;
    }

    private async findAddresses(account: Account): Promise<[PostalLocation, PhysicalLocation, RedirectionAddressDetails]> {
        // It is possible for the account to be null because sometimes there
        // is not a contract for these redirections. In that case, we want to
        // return that it's invalid.
        const details: RedirectionAddressDetails = new RedirectionAddressDetails();
        if (!account) {
            details.valid = false;
            details.message = ERROR_CODES.E116_RedirectionAccountInvalidAddress.message();
            return [null, null, details];
        }
        // Re-query account to be safe (this gets called in multiple places)
        account = await Account.findWithMinimalRelations().andWhere('account.accountId = :id', { id: account.accountId }).getOne();
        const userPhysicalAddress = account.physicalLocation;
        const userPostalAddress = account.postalLocation;

        return [userPostalAddress, userPhysicalAddress, details];
    }

    private async findDriverAddresses(driver: Driver): Promise<[PostalLocation, PhysicalLocation, RedirectionAddressDetails]> {
        // It is possible for the account to be null because sometimes there
        // is not a contract for these redirections. In that case, we want to
        // return that it's invalid.
        const details: RedirectionAddressDetails = new RedirectionAddressDetails();
        // Re-query account to be safe (this gets called in multiple places)
        driver = await Driver.findWithMinimalRelations().andWhere('driver.driverId = :id', { id: driver.driverId }).getOne();
        if (!driver) {
            details.valid = false;
            details.message = ERROR_CODES.E116_RedirectionAccountInvalidAddress.message();
            return [null, null, details];
        }
        const driverPhysicalAddress = driver.physicalLocation;
        const driverPostalAddress = driver.postalLocation;

        return [driverPostalAddress, driverPhysicalAddress, details];
    }

    private async updateUsingPhysicalAddress(
        details: RedirectionAddressDetails,
        userPhysicalAddress: PhysicalLocation,
    ): Promise<RedirectionAddressDetails> {
        // USE PHYSICAL ADDRESS OTHERWISE
        details.location = userPhysicalAddress;
        // 1. Check street code exists for the streetName and city we have for the user. We have to send a streetCode to ATG
        const userStreet = await Street.getByStreetAndCity(userPhysicalAddress.streetName, userPhysicalAddress.city).getOne();
        if (isNil(userStreet)) {
            details.valid = false;
            details.message = ERROR_CODES.E114_InvalidAddressForRedirectionMissingStreetCode.message({
                streetName: userPhysicalAddress.streetName,
                city: userPhysicalAddress.city,
            });
            return details;
        }
        // 2. Set details
        details.streetName = userPhysicalAddress.streetName;
        details.streetNumber = userPhysicalAddress.streetNumber;
        details.streetCode = userStreet.code;
        details.zipCode = userPhysicalAddress.code;
        return details;
    }

    private async updateUsingPostalAddress(
        details: RedirectionAddressDetails,
        userPostalAddress: PostalLocation,
    ): Promise<RedirectionAddressDetails> {
        // USE POSTAL ADDRESS PREFERENTIALLY
        details.location = userPostalAddress;
        // ATG expects the street name to be a postbox and the code to be 0 for postal address (NB not ideal from their side)
        details.streetName = 'ת.ד';
        details.streetCode = '0';
        details.streetNumber = userPostalAddress.postOfficeBox;
        details.zipCode = userPostalAddress.code;
        return details;
    }

    private async checkCity(details: RedirectionAddressDetails): Promise<RedirectionAddressDetails> {
        // Check city to make sure we have a code
        details.issuer = await Issuer.createQueryBuilder('issuer').where('issuer.name = :city', { city: details.location.city }).getOne();
        if (isNil(details.issuer)) {
            details.valid = false;
            details.message = ERROR_CODES.E115_InvalidAddressForRedirectionMissingStreetCode.message({ city: details.location.city });
            return details;
        }
        return details;
    }
}
