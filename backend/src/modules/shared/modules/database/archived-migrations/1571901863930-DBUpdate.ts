import { MigrationInterface, QueryRunner } from 'typeorm';

export class DBUpdate1571901863930 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "issuer" DROP CONSTRAINT "FK_bccdf99658468477549ff0456ba"`);
        await queryRunner.query(`ALTER TABLE "issuer" RENAME COLUMN "paymentIntegrationPaymentIntegrationId" TO "paymentIntegrationId"`);
        await queryRunner.query(
            `ALTER TABLE "issuer" ADD CONSTRAINT "FK_cc3702f57cb147b98f601674ba2" FOREIGN KEY ("paymentIntegrationId") REFERENCES "payment_integration"("paymentIntegrationId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "issuer" DROP CONSTRAINT "FK_cc3702f57cb147b98f601674ba2"`);
        await queryRunner.query(`ALTER TABLE "issuer" RENAME COLUMN "paymentIntegrationId" TO "paymentIntegrationPaymentIntegrationId"`);
        await queryRunner.query(
            `ALTER TABLE "issuer" ADD CONSTRAINT "FK_bccdf99658468477549ff0456ba" FOREIGN KEY ("paymentIntegrationPaymentIntegrationId") REFERENCES "payment_integration"("paymentIntegrationId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
