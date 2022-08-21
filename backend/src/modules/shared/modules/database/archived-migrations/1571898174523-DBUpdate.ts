import { MigrationInterface, QueryRunner } from 'typeorm';

export class DBUpdate1571898174523 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "payment_integration" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "paymentIntegrationId" SERIAL NOT NULL, CONSTRAINT "PK_a8639541b1dae2fecf40189e903" PRIMARY KEY ("paymentIntegrationId"))`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a8639541b1dae2fecf40189e90" ON "payment_integration" ("paymentIntegrationId") `);
        await queryRunner.query(`ALTER TABLE "payment" ADD "paymentIntegrationId" integer`);
        await queryRunner.query(`ALTER TABLE "manual_payment" ADD "paymentIntegrationId" integer`);
        await queryRunner.query(`ALTER TABLE "integration_payment" ADD "paymentIntegrationId" integer`);
        await queryRunner.query(
            `ALTER TABLE "payment" ADD CONSTRAINT "FK_384a6febdae375463d3e4ae0318" FOREIGN KEY ("paymentIntegrationId") REFERENCES "payment_integration"("paymentIntegrationId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "integration_payment" ADD CONSTRAINT "FK_13a93a275c66f1c10ca8b915e8a" FOREIGN KEY ("paymentIntegrationId") REFERENCES "payment_integration"("paymentIntegrationId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "integration_payment" DROP CONSTRAINT "FK_13a93a275c66f1c10ca8b915e8a"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_384a6febdae375463d3e4ae0318"`);
        await queryRunner.query(`ALTER TABLE "integration_payment" DROP COLUMN "paymentIntegrationId"`);
        await queryRunner.query(`ALTER TABLE "manual_payment" DROP COLUMN "paymentIntegrationId"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "paymentIntegrationId"`);
        await queryRunner.query(`DROP INDEX "IDX_a8639541b1dae2fecf40189e90"`);
        await queryRunner.query(`DROP TABLE "payment_integration"`);
    }
}
