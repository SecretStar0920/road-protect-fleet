import { MigrationInterface, QueryRunner } from 'typeorm';

export class IssuerAuthorityFK1576833364612 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "issuer" ADD "authority" text`);
        await queryRunner.query(
            `ALTER TABLE "issuer" ADD CONSTRAINT "FK_22c78e2c62b2fd4dd940475fb1f" FOREIGN KEY ("authority") REFERENCES "issuer"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "issuer" DROP CONSTRAINT "FK_22c78e2c62b2fd4dd940475fb1f"`);
        await queryRunner.query(`ALTER TABLE "issuer" DROP COLUMN "authority"`);
    }
}
