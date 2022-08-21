import { BadRequestException, Injectable } from '@nestjs/common';
import { MetabaseApiIntegrationService } from '@modules/metabase/services/metabase-api-integration.service';
import { Config } from '@config/config';
import { MetabaseEmbedService } from '@modules/metabase/services/metabase-embed.service';
import { IMetabaseItemDetails, IMetabaseItems } from '@modules/metabase/services/metabase-item-details.interface';
import { Account } from '@entities';
import { get, isNil } from 'lodash';
import { Logger } from '@logger';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class MetabaseCollectionService {
    constructor(private api: MetabaseApiIntegrationService, private metabaseEmbedService: MetabaseEmbedService, private logger: Logger) {}

    // TODO: Model the return type here
    async getMetabaseCollections(): Promise<any[]> {
        return this.api.getSecure<any>(Config.get.metabase.apiEndpoints.collections, {});
    }

    // TODO: Model the return type here
    async getMetabaseCollectionById(collectionId: number): Promise<any> {
        return this.api.getSecure<any>(`${Config.get.metabase.apiEndpoints.collections}${collectionId}`);
    }

    async getAllMetabaseCollectionItemsByAccountId(accountId: number): Promise<IMetabaseItems> {
        const account = await Account.findWithMinimalRelations().andWhere('account.accountId = :accountId', { accountId }).getOne();
        if (isNil(account)) {
            throw new BadRequestException({
                message: ERROR_CODES.E026_CouldNotFindAccount.message({ accountId }),
            });
        }

        this.logger.log({
            message: `Get metabase item details for default metabase collection`,
            fn: this.getAllMetabaseCollectionItemsByAccountId.name,
        });

        // Get items for default collection
        let items: IMetabaseItemDetails[] = await this.getMetabaseCollectionItemsByCollectionId(
            Config.get.metabase.collections.default,
            accountId,
        );

        const collectionIds = get(account, 'accountMetabaseReporting.customCollections', false);
        if (!collectionIds) {
            this.logger.log({
                message: `Account does not have custom metabase collections`,
                fn: this.getAllMetabaseCollectionItemsByAccountId.name,
                detail: account,
            });
            return { data: items };
        }

        this.logger.log({
            message: `Get metabase item details for custom metabase collections`,
            fn: this.getAllMetabaseCollectionItemsByAccountId.name,
        });

        for (const customCollectionId of collectionIds) {
            const result: IMetabaseItemDetails[] = await this.getMetabaseCollectionItemsByCollectionId(customCollectionId, accountId);
            items = items.concat(result);
        }
        return { data: items };
    }

    async getMetabaseCollectionItemsByCollectionId(collectionId: number, accountId: number): Promise<IMetabaseItemDetails[]> {
        let items: IMetabaseItemDetails[] = await this.api.getSecure<any>(
            `${Config.get.metabase.apiEndpoints.collections}${collectionId}/items`,
        );
        items = this.getEmbedUrlsForCollectionItems(items, accountId);
        return items;
    }

    private getEmbedUrlsForCollectionItems(items: IMetabaseItemDetails[], accountId: number) {
        return items
            .filter((item) => {
                // We only can embed cards and dashboards
                return item.model === 'card' || item.model === 'dashboard';
            })
            .map((item) => {
                item.embeddedUrl = this.metabaseEmbedService.getPrefilteredEmbedUrl(accountId, item.model, item.id);
                return item;
            });
    }
}
