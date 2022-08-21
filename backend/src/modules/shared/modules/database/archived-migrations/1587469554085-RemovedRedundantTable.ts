import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovedRedundantTable1587469554085 implements MigrationInterface {
    name = 'RemovedRedundantTable1587469554085';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "credit_guard_token" ADD "paymentReference" text NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "credit_guard_token" ADD "active" boolean NOT NULL DEFAULT false`, undefined);

        await queryRunner.query(`ALTER TABLE "issuer" DROP CONSTRAINT "FK_cc3702f57cb147b98f601674ba2"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_384a6febdae375463d3e4ae0318"`, undefined);
        await queryRunner.query(`ALTER TABLE "integration_payment" DROP CONSTRAINT "FK_13a93a275c66f1c10ca8b915e8a"`, undefined);
        await queryRunner.query(`ALTER TABLE "issuer" DROP COLUMN "paymentIntegrationId"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "paymentIntegrationId"`, undefined);
        await queryRunner.query(`ALTER TABLE "integration_payment" DROP COLUMN "paymentIntegrationId"`, undefined);
        await queryRunner.query(`ALTER TABLE "manual_payment" DROP COLUMN "paymentIntegrationId"`, undefined);
        await queryRunner.query(`ALTER TABLE "issuer" ALTER COLUMN "integrationDetails" SET DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "issuer" ALTER COLUMN "integrationDetails" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "credit_guard_token" DROP COLUMN "active"`, undefined);
        await queryRunner.query(`ALTER TABLE "credit_guard_token" DROP COLUMN "paymentReference"`, undefined);
        await queryRunner.query(`ALTER TABLE "manual_payment" ADD "paymentIntegrationId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "integration_payment" ADD "paymentIntegrationId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" ADD "paymentIntegrationId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "issuer" ADD "paymentIntegrationId" integer`, undefined);
        await queryRunner.query(
            `ALTER TABLE "integration_payment" ADD CONSTRAINT "FK_13a93a275c66f1c10ca8b915e8a" FOREIGN KEY ("paymentIntegrationId") REFERENCES "payment_integration"("paymentIntegrationId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "payment" ADD CONSTRAINT "FK_384a6febdae375463d3e4ae0318" FOREIGN KEY ("paymentIntegrationId") REFERENCES "payment_integration"("paymentIntegrationId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "issuer" ADD CONSTRAINT "FK_cc3702f57cb147b98f601674ba2" FOREIGN KEY ("paymentIntegrationId") REFERENCES "payment_integration"("paymentIntegrationId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }
}
