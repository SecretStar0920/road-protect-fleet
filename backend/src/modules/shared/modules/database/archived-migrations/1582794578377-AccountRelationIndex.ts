import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountRelationIndex1582794578377 implements MigrationInterface {
    name = 'AccountRelationIndex1582794578377';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE INDEX "IDX_a85cb73c8fe88457749268b482" ON "account_relation" ("forwardAccountId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_ab62664f62d2545c0e5a12bdea" ON "account_relation" ("reverseAccountId") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_ab62664f62d2545c0e5a12bdea"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_a85cb73c8fe88457749268b482"`, undefined);
    }
}
