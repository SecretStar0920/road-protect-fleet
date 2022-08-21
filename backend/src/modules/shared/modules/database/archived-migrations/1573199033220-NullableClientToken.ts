import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableClientToken1573199033220 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "token" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "token" SET NOT NULL`);
    }
}
