import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TestApp } from './helpers/test-app.singleton';

beforeAll(async () => {
    const app = await TestApp.app();
});

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await TestApp.app();
    });

    it('/api/v1/health (GET)', () => {
        return request(app.getHttpServer()).get('/health').expect(200).expect({ dbConnected: true });
    });

    afterAll(async () => {
        await TestApp.closeApp();
    });
});
