import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Logger } from '@logger';
import { Config } from '@config/config';
import { get } from 'lodash';
import got from 'got';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class MetabaseApiIntegrationService {
    private authToken: string;
    private authTokenExpiryTime: moment.Moment;

    constructor(private logger: Logger) {}

    private url(endpoint: string): string {
        return `${Config.get.metabase.apiUrl}/api/${endpoint}`;
    }

    private async getMetabaseApiAuthToken(): Promise<string> {
        try {
            if (this.authToken && moment().isBefore(this.authTokenExpiryTime)) {
                return this.authToken;
            }
            this.logger.debug({ message: 'Authenticating with Metabase api', fn: this.getMetabaseApiAuthToken.name });

            // Get api credentials
            const body = Config.get.metabase.apiCredentials;

            // Post to metabase
            const response = await this.post(Config.get.metabase.apiEndpoints.login, body);
            this.logger.debug({ message: 'Authenticated with Metabase api', fn: this.getMetabaseApiAuthToken.name });
            // Save to service with expiry time
            this.authToken = get(response, 'id');
            this.authTokenExpiryTime = moment().add('14', 'days');
            return this.authToken;
        } catch (e) {
            this.logger.error({ message: 'Failed to login to metabase', fn: this.getMetabaseApiAuthToken.name, detail: e });
            throw new Error(ERROR_CODES.E130_MetabaseAuthenticationFailed.message());
        }
    }

    private async post<T>(endpoint: string, body: any = {}, options: any = {}): Promise<T> {
        options.json = body;
        const url = this.url(endpoint);
        return got.post(url, options).json();
    }

    private async setHeaders(currentHeaders: any): Promise<Headers> {
        return {
            ...currentHeaders,
            'X-Metabase-Session': await this.getMetabaseApiAuthToken(),
        };
    }

    async postSecure<T>(endpoint: string, body: any = {}, options: any = {}): Promise<T> {
        options.json = body;
        options.headers = await this.setHeaders(options.headers);
        const url = this.url(endpoint);
        this.logger.debug({ message: `METABASE: (POST) ${url}`, fn: this.postSecure.name });
        const result = await got.post(url, options).json();
        this.logger.debug({ message: `METABASE: (POST) ${url} result`, detail: result, fn: this.postSecure.name });
        return result as T;
    }

    async getSecure<T>(endpoint: string, options: any = {}): Promise<T> {
        options.headers = await this.setHeaders(options.headers);
        const url = this.url(endpoint);
        this.logger.debug({ message: `METABASE: (POST) ${url}`, fn: this.getSecure.name });
        const result = await got.get(url, options).json();
        this.logger.debug({ message: `METABASE: (POST) ${url} result`, detail: result, fn: this.getSecure.name });
        return result as T;
    }
}
