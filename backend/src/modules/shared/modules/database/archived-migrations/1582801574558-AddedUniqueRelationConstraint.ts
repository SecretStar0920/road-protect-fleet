import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedUniqueRelationConstraint1582801574558 implements MigrationInterface {
    name = 'AddedUniqueRelationConstraint1582801574558';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER TABLE "account_relation" ADD CONSTRAINT "unique_relation" UNIQUE ("forwardAccountId", "reverseAccountId")`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "account_relation" DROP CONSTRAINT "unique_relation"`, undefined);
    }
}
