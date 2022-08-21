import { MigrationInterface, QueryRunner } from 'typeorm';

export class InfringementTypeField1575972214582 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "infringement_type_enum" AS ENUM('Parking', 'Traffic', 'Environmental', 'Other')`);
        await queryRunner.query(`ALTER TABLE "infringement" ADD "type" "infringement_type_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "infringement" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "infringement_type_enum"`);
    }
}
