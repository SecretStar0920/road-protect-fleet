import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableFKContract1575269073553 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_a45df5a99d61f11c78719bd6129"`);
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "ownerId" DROP NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "contract" ADD CONSTRAINT "FK_a45df5a99d61f11c78719bd6129" FOREIGN KEY ("ownerId") REFERENCES "account"("accountId") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_a45df5a99d61f11c78719bd6129"`);
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "ownerId" SET NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "contract" ADD CONSTRAINT "FK_a45df5a99d61f11c78719bd6129" FOREIGN KEY ("ownerId") REFERENCES "account"("accountId") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
    }
}
