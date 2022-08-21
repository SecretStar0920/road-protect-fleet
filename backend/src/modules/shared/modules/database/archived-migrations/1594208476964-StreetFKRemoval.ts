import { MigrationInterface, QueryRunner } from 'typeorm';

export class StreetFKRemoval1594208476964 implements MigrationInterface {
    name = 'StreetFKRemoval1594208476964';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "street" DROP CONSTRAINT "FK_2cf1b56efdcec9c2bdb440b1765"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_2cf1b56efdcec9c2bdb440b176"`, undefined);
        await queryRunner.query(`ALTER TABLE "street" RENAME COLUMN "issuer_name" TO "issuer"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_4b9012f2edc7449076fe0ca218" ON "street" ("issuer") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_4b9012f2edc7449076fe0ca218"`, undefined);
        await queryRunner.query(`ALTER TABLE "street" RENAME COLUMN "issuer" TO "issuer_name"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_2cf1b56efdcec9c2bdb440b176" ON "street" ("issuer_name") `, undefined);
        await queryRunner.query(
            `ALTER TABLE "street" ADD CONSTRAINT "FK_2cf1b56efdcec9c2bdb440b1765" FOREIGN KEY ("issuer_name") REFERENCES "issuer"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }
}
