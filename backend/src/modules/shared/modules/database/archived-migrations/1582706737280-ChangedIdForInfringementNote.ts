import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangedIdForInfringementNote1582706737280 implements MigrationInterface {
    name = 'ChangedIdForInfringementNote1582706737280';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "infringement_note" RENAME COLUMN "noteId" TO "infringementNoteId"`, undefined);
        await queryRunner.query(
            `ALTER TABLE "infringement_note" RENAME CONSTRAINT "PK_6c73ac1c46979feb716da701e4d" TO "PK_17f1e687d7754dbc7d8aa1633ca"`,
            undefined,
        );
        await queryRunner.query(
            `ALTER SEQUENCE "infringement_note_noteId_seq" RENAME TO "infringement_note_infringementNoteId_seq"`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER SEQUENCE "infringement_note_infringementNoteId_seq" RENAME TO "infringement_note_noteId_seq"`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "infringement_note" RENAME CONSTRAINT "PK_17f1e687d7754dbc7d8aa1633ca" TO "PK_6c73ac1c46979feb716da701e4d"`,
            undefined,
        );
        await queryRunner.query(`ALTER TABLE "infringement_note" RENAME COLUMN "infringementNoteId" TO "noteId"`, undefined);
    }
}
