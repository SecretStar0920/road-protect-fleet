import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixIntegrationPaymentInfFK1587728079955 implements MigrationInterface {
    name = 'FixIntegrationPaymentInfFK1587728079955';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "issuer" ALTER COLUMN "integrationDetails" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_7e4ad0cec89de637ad5ccaa1bd3"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "REL_7e4ad0cec89de637ad5ccaa1bd"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "payment" ADD CONSTRAINT "FK_7e4ad0cec89de637ad5ccaa1bd3" FOREIGN KEY ("infringementId") REFERENCES "infringement"("infringementId") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_7e4ad0cec89de637ad5ccaa1bd3"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "payment" ADD CONSTRAINT "REL_7e4ad0cec89de637ad5ccaa1bd" UNIQUE ("infringementId")`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "payment" ADD CONSTRAINT "FK_7e4ad0cec89de637ad5ccaa1bd3" FOREIGN KEY ("infringementId") REFERENCES "infringement"("infringementId") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        );
        await queryRunner.query(`ALTER TABLE "issuer" ALTER COLUMN "integrationDetails" DROP DEFAULT`, undefined);
    }
}
