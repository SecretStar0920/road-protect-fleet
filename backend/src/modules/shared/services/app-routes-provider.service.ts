import { Injectable } from '@nestjs/common';
import { Config } from '@config/config';
import { InfringementStatus } from '@entities';
const { URL, URLSearchParams } = require('url');

@Injectable()
export class AppRoutesProviderService {

    constructor() {
    }

    getViewAccountVehiclesRoute(): string {
        let params = []
        return this.build('home/account/vehicles', params)
    }
    getViewAccountInfringementsRoute(
        statuses: InfringementStatus[] | undefined = undefined,
        latestPaymentDate: {from: string | undefined, to: string | undefined} | undefined = undefined
    ): string {

        let params = [];
        if (statuses !== undefined) {
            statuses.forEach( (status) => params.push({key: 'status', value: status}))
        }

        if (latestPaymentDate?.from !== undefined) {
            params.push({key: 'approvedDate.min', value: latestPaymentDate!!.from})
        }

        if (latestPaymentDate?.to !== undefined) {
            params.push({key: 'approvedDate.max', value: latestPaymentDate!!.to})
        }

        return this.build('home/account/infringements', params)
    }

    private build(path: string, params: {key: string, value: string}[] = []) {
        let url = this.baseUrl
        url += path

        const query = params.map(({key, value}) => `${key}=${value}`).join('&')
        url += `?${query}`

        return url
    }

    private get baseUrl(): string {
        let baseUrl = Config.get.app.url
        if (!baseUrl.endsWith('/')) {
            baseUrl += '/'
        }

        return baseUrl
    }



}
