import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetNullOnDeleteContractDocument1582275542835 implements MigrationInterface {
    name = 'SetNullOnDeleteContractDocument1582275542835';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_8117e5f1553ccc8b07a8a0c6912"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "contract" ADD CONSTRAINT "FK_8117e5f1553ccc8b07a8a0c6912" FOREIGN KEY ("documentId") REFERENCES "document"("documentId") ON DELETE SET NULL ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_8117e5f1553ccc8b07a8a0c6912"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "contract" ADD CONSTRAINT "FK_8117e5f1553ccc8b07a8a0c6912" FOREIGN KEY ("documentId") REFERENCES "document"("documentId") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        );
    }
}
