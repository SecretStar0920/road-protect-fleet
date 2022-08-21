import { Injectable, NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Logger } from '@logger';
import { Request } from 'express';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export class AsyncStoreNotDefinedException extends Error {
    constructor() {
        super(ERROR_CODES.E001_AsyncStoreNotDefined.message());
    }
}

export class AsyncStorageData {
    constructor(contextId: number, identity: () => IdentityDto, request: () => Request) {
        this.contextId = contextId;
        this.identity = identity;
        this.request = request;
    }
    contextId: number = 0;
    identity: () => IdentityDto;
    request: () => Request;
}

export class AsyncStorageHelper {
    static STORAGE = new AsyncLocalStorage<AsyncStorageData>();

    static getStore(): AsyncStorageData {
        return this.STORAGE.getStore();
    }

    static getStoreSafe(): AsyncStorageData {
        const store = this.getStore();
        if (!store) {
            Logger.instance.error({ message: 'Missing store, most likely the [async chain] is broken', fn: 'AsyncStorageHelper' });
            throw new AsyncStoreNotDefinedException();
        }
        return store;
    }

    static getStorage(): AsyncLocalStorage<AsyncStorageData> {
        return this.STORAGE;
    }
}

@Injectable()
export class AsyncLocalStorageMiddleware implements NestMiddleware {
    runCount = 0;
    async use(req: any, res: any, next: () => void) {
        return AsyncStorageHelper.getStorage().run(
            new AsyncStorageData(
                ++this.runCount,
                () => req?.identity,
                () => req,
            ),
            next,
        );
    }
}
