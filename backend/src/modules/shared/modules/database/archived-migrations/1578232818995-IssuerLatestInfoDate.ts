import { MigrationInterface, QueryRunner } from 'typeorm';

export class IssuerLatestInfoDate1578232818995 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "issuer" ADD "latestInfoDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`CREATE INDEX "IDX_4bf1c6b280fc9c914a842a71b4" ON "issuer" ("latestInfoDate") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_4bf1c6b280fc9c914a842a71b4"`);
        await queryRunner.query(`ALTER TABLE "issuer" DROP COLUMN "latestInfoDate"`);
    }
}
