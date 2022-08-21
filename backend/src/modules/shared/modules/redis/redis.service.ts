import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Config } from '@config/config';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    protected _instance: Redis.Redis = null;

    constructor() {
        this._instance = this.createNewInstance();
    }

    protected createNewInstance() {
        return new Redis({
            host: Config.get.redis.host,
            port: Config.get.redis.port,
        });
    }

    client() {
        return this._instance;
    }

    onModuleDestroy(): any {
        this._instance.disconnect();
        this._instance = null;
    }
}
