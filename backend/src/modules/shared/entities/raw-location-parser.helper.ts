import { CreateLocationDetailedDto, CreateLocationSingleDto } from '@modules/location/controllers/create-location-detailed.dto';
import { plainToClass } from 'class-transformer';
import { isEmpty, merge } from 'lodash';
import { UpdateLocationDetailedDto, UpdateLocationSingleDto } from '@modules/location/controllers/update-location-detailed-dto';
import { Logger } from '@logger';

export class RawLocationParserHelper {
    static parseCreateDto(dto: CreateLocationSingleDto): CreateLocationDetailedDto {
        let shared = plainToClass(CreateLocationDetailedDto, dto);
        shared = merge(shared, this.parseRawAddress(dto.rawAddress, dto.city));
        return shared;
    }

    static parseUpdateDto(dto: UpdateLocationSingleDto): UpdateLocationDetailedDto {
        let shared = plainToClass(UpdateLocationDetailedDto, dto);
        shared = merge(shared, this.parseRawAddress(dto.rawAddress, dto.city));
        return shared;
    }

    static parseRawAddress(
        rawAddress: string,
        city?: string,
    ): { streetName?: string; streetNumber?: string; postOfficeBox?: string; city?: string; rawAddress: string } {
        // TODO

        const toReturn: any = {};
        toReturn.rawAddress = rawAddress;
        try {
            if (!isEmpty(rawAddress.match(/ת.ד./))) {
                // Check if it is a POBox and extract digits as the postOfficeBox
                toReturn.postOfficeBox = /(\d+)/g.exec(rawAddress)[1];
            } else {
                // 1. Extract digits as street number otherwise
                const streetNumberRegEx = /(\d+)/g.exec(rawAddress);
                if (streetNumberRegEx) {
                    toReturn.streetNumber = streetNumberRegEx[1].trim();
                }

                // 2. Extract street name as all non-digits
                const streetNameRegEx = /(\D+)/g.exec(rawAddress);
                if (streetNameRegEx) {
                    toReturn.streetName = streetNameRegEx[1].trim();
                }

                // 3. If a city was provided remove it from the streetName
                if (city) {
                    city = city.trim();
                    toReturn.city = city;
                    toReturn.streetName.replace(city.trim(), '');
                }
            }
        } catch (e) {
            Logger.instance.error({
                message: 'Failed to parse a raw address',
                detail: { rawAddress, city },
                fn: this.parseRawAddress.name,
            });
        }

        return toReturn;
    }
}
