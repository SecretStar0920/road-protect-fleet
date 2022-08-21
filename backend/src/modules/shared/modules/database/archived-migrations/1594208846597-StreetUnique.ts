import { MigrationInterface, QueryRunner } from 'typeorm';

export class StreetUnique1594208846597 implements MigrationInterface {
    name = 'StreetUnique1594208846597';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "street" ADD CONSTRAINT "UQ_2cf1b56efdcec9c2bdb440b1765" UNIQUE ("name", "issuer")`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "street" DROP CONSTRAINT "UQ_2cf1b56efdcec9c2bdb440b1765"`, undefined);
    }
}
