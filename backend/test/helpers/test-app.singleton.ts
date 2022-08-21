import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { initialiseTestTransactions } from 'typeorm-test-transactions';
import { SchedulerRegistry } from '@nestjs/schedule';

initialiseTestTransactions();

export class TestApp {
    private static count = 0;
    private static requestCount: number;
    private static isConstructed: boolean = false;
    private static _app: INestApplication;
    static async app(): Promise<INestApplication> {
        TestApp.requestCount = (TestApp.requestCount || 0) + 1;
        if (!TestApp.isConstructed) {
            await TestApp.createApp();
        }

        return TestApp._app;
    }

    private static async createApp() {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        const app = moduleFixture.createNestApplication();
        await app.init();

        TestApp.isConstructed = true;
        TestApp._app = app;
        await this.disableSchedulers();
    }

    private static async disableSchedulers() {
        const registry: SchedulerRegistry = this._app.get('SchedulerRegistry');
        const schedules = registry.getCronJobs();

        for (const schedule of schedules.keys()) {
            registry.deleteCronJob(schedule);
        }
    }

    static async closeApp() {
        if (!TestApp.isConstructed) {
            return;
        }
        await TestApp._app.close();
        this._app = null;
    }
}
