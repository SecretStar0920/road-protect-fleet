import { MigrationInterface, QueryRunner } from 'typeorm';

export class StreetTable1582101380157 implements MigrationInterface {
    name = 'StreetTable1582101380157';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "street" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "streetId" SERIAL NOT NULL, "name" text NOT NULL, "code" text NOT NULL, "issuer_name" text NOT NULL, CONSTRAINT "PK_1cb8e4aca398c60e7c3c811737c" PRIMARY KEY ("streetId"))`,
            undefined,
        );
        await queryRunner.query(`CREATE INDEX "IDX_f0567bb5ed56fd545d891528ac" ON "street" ("name") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_f98f404542190ee497e7936570" ON "street" ("code") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_2cf1b56efdcec9c2bdb440b176" ON "street" ("issuer_name") `, undefined);
        await queryRunner.query(
            `ALTER TABLE "street" ADD CONSTRAINT "FK_2cf1b56efdcec9c2bdb440b1765" FOREIGN KEY ("issuer_name") REFERENCES "issuer"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "street" DROP CONSTRAINT "FK_2cf1b56efdcec9c2bdb440b1765"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_2cf1b56efdcec9c2bdb440b176"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_f98f404542190ee497e7936570"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_f0567bb5ed56fd545d891528ac"`, undefined);
        await queryRunner.query(`DROP TABLE "street"`, undefined);
    }
}
