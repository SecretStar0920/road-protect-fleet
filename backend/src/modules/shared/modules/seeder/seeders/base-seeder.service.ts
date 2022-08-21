import { Logger } from '@logger';
import { Config } from '@config/config';

export abstract class BaseSeederService<T = any> {
    protected seedData: Partial<T>[] = [];
    protected abstract seederName: string;
    protected isDevelopment = Config.get.isDevelopment() || Config.get.isStaging();

    protected constructor(protected logger: Logger = Logger.instance) {}

    abstract async setSeedData();

    abstract async seedItemFunction(item: Partial<T>);

    async run() {
        await this.setSeedData();
        this.logger.debug({ message: `[${this.seederName}] - starting...`, fn: this.run.name });
        // For each seed user
        for (const item of this.seedData) {
            await this.onSeedItem(item);
        }
        this.logger.debug({ message: `[${this.seederName}] - completed \u2714 `, fn: this.run.name });
    }

    async onSeedItem(item: Partial<T>) {
        this.onItemStart(item);
        await this.seedItemFunction(item);
        this.onItemEnd(item);
    }

    private onItemStart(item: Partial<T>) {
        this.logger.debug({ message: `[${this.seederName}] - item: `, detail: item, fn: this.onItemStart.name });
    }

    private onItemEnd(item: Partial<T>) {
        this.logger.debug({ message: `[${this.seederName}] - item seeded successfully`, fn: this.onItemEnd.name });
    }
}
