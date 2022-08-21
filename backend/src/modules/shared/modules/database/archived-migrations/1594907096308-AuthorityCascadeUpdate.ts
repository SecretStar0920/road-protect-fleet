import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuthorityCascadeUpdate1594907096308 implements MigrationInterface {
    name = 'AuthorityCascadeUpdate1594907096308';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "issuer" DROP CONSTRAINT "FK_22c78e2c62b2fd4dd940475fb1f"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "issuer" ADD CONSTRAINT "FK_22c78e2c62b2fd4dd940475fb1f" FOREIGN KEY ("authority") REFERENCES "issuer"("name") ON DELETE SET NULL ON UPDATE CASCADE`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "issuer" DROP CONSTRAINT "FK_22c78e2c62b2fd4dd940475fb1f"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "issuer" ADD CONSTRAINT "FK_22c78e2c62b2fd4dd940475fb1f" FOREIGN KEY ("authority") REFERENCES "issuer"("name") ON DELETE SET NULL ON UPDATE NO ACTION`,
            undefined,
        );
    }
}
