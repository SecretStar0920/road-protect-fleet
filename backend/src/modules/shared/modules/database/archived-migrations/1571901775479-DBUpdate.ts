import { MigrationInterface, QueryRunner } from 'typeorm';

export class DBUpdate1571901775479 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "issuer" ADD "paymentIntegrationPaymentIntegrationId" integer`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "details" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "issuer" ADD CONSTRAINT "FK_bccdf99658468477549ff0456ba" FOREIGN KEY ("paymentIntegrationPaymentIntegrationId") REFERENCES "payment_integration"("paymentIntegrationId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "issuer" DROP CONSTRAINT "FK_bccdf99658468477549ff0456ba"`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "details" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "issuer" DROP COLUMN "paymentIntegrationPaymentIntegrationId"`);
    }
}
