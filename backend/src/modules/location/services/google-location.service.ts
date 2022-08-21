import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@logger';
import * as maps from '@google/maps';
import {
    ClientResponse,
    FindPlaceFromTextResponse,
    FindPlaceRequest,
    GeocodingRequest,
    GeocodingResponse,
    GoogleMapsClientWithPromise,
    PlaceSearchResult,
} from '@google/maps';
import { Config } from '@config/config';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GoogleLocationService {
    private places: GoogleMapsClientWithPromise;

    constructor(private logger: Logger) {
        this.places = maps.createClient({
            key: Config.get.google.maps.key,
            Promise,
        });
    }

    async placeSearch(location: string): Promise<Partial<PlaceSearchResult>[]> {
        try {
            const query: FindPlaceRequest = {
                input: location,
                inputtype: 'textquery',
                fields: ['formatted_address', 'geometry'],
            };
            const result: ClientResponse<FindPlaceFromTextResponse> = await this.places.findPlace(query).asPromise();

            return result.json.candidates;
        } catch (e) {
            this.logger.error({
                message: 'Failed to query places api for the location',
                detail: {
                    error: e.message,
                    stack: e.stack,
                },
                fn: this.placeSearch.name,
            });
            throw new InternalServerErrorException({ message: ERROR_CODES.E125_FailedToQueryAddressFromGoogle.message({ location }) });
        }
    }

    async geocode(location: string): Promise<GeocodingResponse> {
        try {
            const query: GeocodingRequest = {
                address: location,
                language: 'he',
            };
            const result: ClientResponse<GeocodingResponse> = await this.places.geocode(query).asPromise();

            return result.json;
        } catch (e) {
            this.logger.error({
                message: 'Failed to query places api for the location',
                detail: {
                    error: e.message,
                    stack: e.stack,
                },
                fn: this.geocode.name,
            });
            throw new InternalServerErrorException({ message: ERROR_CODES.E125_FailedToQueryAddressFromGoogle.message({ location }) });
        }
    }
}
