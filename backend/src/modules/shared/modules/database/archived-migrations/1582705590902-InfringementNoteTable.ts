import { MigrationInterface, QueryRunner } from 'typeorm';

export class InfringementNoteTable1582705590902 implements MigrationInterface {
    name = 'InfringementNoteTable1582705590902';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "infringement_note" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "noteId" SERIAL NOT NULL, "value" text NOT NULL, "createdBy" integer, "infringementId" integer, CONSTRAINT "PK_6c73ac1c46979feb716da701e4d" PRIMARY KEY ("noteId"))`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "infringement_note" ADD CONSTRAINT "FK_faea880c70607100decc6d8e3b0" FOREIGN KEY ("createdBy") REFERENCES "account"("accountId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "infringement_note" ADD CONSTRAINT "FK_475ddc42f9ee074f9c851b228dc" FOREIGN KEY ("infringementId") REFERENCES "infringement"("infringementId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "infringement_note" DROP CONSTRAINT "FK_475ddc42f9ee074f9c851b228dc"`, undefined);
        await queryRunner.query(`ALTER TABLE "infringement_note" DROP CONSTRAINT "FK_faea880c70607100decc6d8e3b0"`, undefined);
        await queryRunner.query(`DROP TABLE "infringement_note"`, undefined);
    }
}
