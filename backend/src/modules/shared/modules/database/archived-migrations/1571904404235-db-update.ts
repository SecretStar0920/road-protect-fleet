import { MigrationInterface, QueryRunner } from 'typeorm';

export class dbUpdate1571904404235 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "payment_integration" ALTER COLUMN "active" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "payment_integration" ALTER COLUMN "active" DROP DEFAULT`);
    }
}
