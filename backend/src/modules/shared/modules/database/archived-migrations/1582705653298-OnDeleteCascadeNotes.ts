import { MigrationInterface, QueryRunner } from 'typeorm';

export class OnDeleteCascadeNotes1582705653298 implements MigrationInterface {
    name = 'OnDeleteCascadeNotes1582705653298';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "infringement_note" DROP CONSTRAINT "FK_475ddc42f9ee074f9c851b228dc"`, undefined);
        await queryRunner.query(`ALTER TABLE "infringement_note" DROP CONSTRAINT "FK_faea880c70607100decc6d8e3b0"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "infringement_note" ADD CONSTRAINT "FK_faea880c70607100decc6d8e3b0" FOREIGN KEY ("createdBy") REFERENCES "account"("accountId") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "infringement_note" ADD CONSTRAINT "FK_475ddc42f9ee074f9c851b228dc" FOREIGN KEY ("infringementId") REFERENCES "infringement"("infringementId") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "infringement_note" DROP CONSTRAINT "FK_475ddc42f9ee074f9c851b228dc"`, undefined);
        await queryRunner.query(`ALTER TABLE "infringement_note" DROP CONSTRAINT "FK_faea880c70607100decc6d8e3b0"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "infringement_note" ADD CONSTRAINT "FK_faea880c70607100decc6d8e3b0" FOREIGN KEY ("createdBy") REFERENCES "account"("accountId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "infringement_note" ADD CONSTRAINT "FK_475ddc42f9ee074f9c851b228dc" FOREIGN KEY ("infringementId") REFERENCES "infringement"("infringementId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }
}
