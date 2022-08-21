import { MigrationInterface, QueryRunner } from 'typeorm';

export class IssuerCompositeUniqueCode1576846309597 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "issuer" DROP CONSTRAINT "unique_issuer_code"`);
        await queryRunner.query(`ALTER TABLE "issuer" ADD CONSTRAINT "unique_issuer_code" UNIQUE ("code", "type")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "issuer" DROP CONSTRAINT "unique_issuer_code"`);
        await queryRunner.query(`ALTER TABLE "issuer" ADD CONSTRAINT "unique_issuer_code" UNIQUE ("code")`);
    }
}
