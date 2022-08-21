import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Account } from '@entities';
import { Config } from '@config/config';
import * as jwt from 'jsonwebtoken';
import { MetabaseModel, MODEL_RESOURCE_MAP } from '@modules/metabase/services/metabase-item-details.interface';

@Injectable()
export class MetabaseEmbedService {
    private METABASE_SITE_URL = Config.get.metabase.url;
    private METABASE_SECRET = Config.get.metabase.secret;

    constructor(private logger: Logger) {}

    async createAccountDashboardUrl(account: Account): Promise<string> {
        const resource = { dashboard: this.getDashboardId(account) };
        const params = { account_id: account.accountId };

        const token = this.signJwt(resource, params);

        return this.METABASE_SITE_URL + '/embed/dashboard/' + token + '#bordered=false&titled=false';
    }

    signJwt(resource: any, params: any): string {
        const payload = {
            resource,
            params,
            exp: Math.round(Date.now() / 1000) + 60 * 60 * 24 * 365 * 10, // 10 years
        };

        return jwt.sign(payload, this.METABASE_SECRET);
    }

    getPrefilteredEmbedUrl(accountId: number, model: MetabaseModel, id: number) {
        const resource: any = {};
        if (model === 'card') {
            resource.question = id;
        } else if (model === 'dashboard') {
            resource.dashboard = id;
        } else {
            return;
        }
        const params = { account_id: accountId };
        const token = this.signJwt(resource, params);
        return `${this.METABASE_SITE_URL}/embed/${MODEL_RESOURCE_MAP[model]}/${token}#bordered=false&titled=false`;
    }

    /**
     * Regenerates embed URL's for all accounts
     */
    async regenerateUrls() {
        const accounts = await Account.find();

        for (const account of accounts) {
            await this.updateAccountReportingEmbedUrl(account);
        }
    }

    async updateAccountReportingEmbedUrl(account: Account) {
        account.details.reportingEmbedUrl = await this.createAccountDashboardUrl(account);
        await account.save();
    }

    getDashboardId(account: Account): number {
        const customDashboardsByAccountId = {
            8: 65,
        };
        if (customDashboardsByAccountId.hasOwnProperty(account.accountId)) {
            return customDashboardsByAccountId[account.accountId];
        }
        return Number(Config.get.metabase.dashboards.account);
    }
}
