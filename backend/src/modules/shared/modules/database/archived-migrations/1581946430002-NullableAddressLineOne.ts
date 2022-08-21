import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableAddressLineOne1581946430002 implements MigrationInterface {
    name = 'NullableAddressLineOne1581946430002';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "addressLineOne" DROP NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "addressLineOne" SET NOT NULL`, undefined);
    }
}
