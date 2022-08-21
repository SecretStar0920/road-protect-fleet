import { MigrationInterface, QueryRunner } from 'typeorm';

export class DocumentUUIDFix1582040071931 implements MigrationInterface {
    name = 'DocumentUUIDFix1582040071931';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "document" ALTER COLUMN "storageName" TYPE TEXT;`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "document" ALTER COLUMN "storageName" TYPE UUID;`, undefined);
    }
}
