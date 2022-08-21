import { MigrationInterface, QueryRunner } from 'typeorm';

export class RedirectionDocumentForLeaseContract1580290496114 implements MigrationInterface {
    name = 'RedirectionDocumentForLeaseContract1580290496114';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "contract" ADD "redirectionDocumentId" integer`, undefined);
        await queryRunner.query(
            `ALTER TABLE "contract" ADD CONSTRAINT "UQ_da9c7db171aef9fef0c2a54653a" UNIQUE ("redirectionDocumentId")`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "contract" ADD CONSTRAINT "FK_da9c7db171aef9fef0c2a54653a" FOREIGN KEY ("redirectionDocumentId") REFERENCES "document"("documentId") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_da9c7db171aef9fef0c2a54653a"`, undefined);
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "UQ_da9c7db171aef9fef0c2a54653a"`, undefined);
        await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "redirectionDocumentId"`, undefined);
    }
}
