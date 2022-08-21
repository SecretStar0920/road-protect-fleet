import { Injectable } from '@nestjs/common';
import { parseStringPromise } from 'xml2js';
import { httpClient } from '@modules/shared/http-client/http-client';

export interface IturanIntegrationCredentials {
    username: string;
    password: string;
}

@Injectable()
export class IturanIntegration {
    private credentials: IturanIntegrationCredentials;

    async getVehicleLocationRecords(accountId, registration, startDate, endDate) {
        this.credentials = this.getCredentialsByAccountId(accountId);
        const url = `https://www.ituran.com/ituranwebservice3/Service3.asmx/GetFullReport?UserName=${this.credentials.username}&Password=${this.credentials.password}&Plate=${registration}&Start=${startDate}&End=${endDate}&UAID=0&MaxNumberOfRecords=5`;
        const response = await httpClient.get(url).text();
        return await parseStringPromise(response, { trim: true, normalizeTags: true, explicitArray: false });
    }

    getCredentialsByAccountId(accountId): IturanIntegrationCredentials {
        // FIXME: make a secret
        const accountsCredentials = {
            8: { username: 'wsstrauss', password: 'ws123456' },
        };
        if (accountsCredentials.hasOwnProperty(accountId)) {
            return accountsCredentials[accountId];
        }
    }
}
