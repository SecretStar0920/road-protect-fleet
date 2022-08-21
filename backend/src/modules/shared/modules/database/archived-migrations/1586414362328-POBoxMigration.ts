import { MigrationInterface, QueryRunner } from 'typeorm';

export class POBoxMigration1586414362328 implements MigrationInterface {
    name = 'POBoxMigration1586414362328';

    public async up(queryRunner: QueryRunner): Promise<any> {
        // Set pobox
        await queryRunner.query(`
            update location set
            "postOfficeBox" = "streetNumber",
            "streetName" = null,
            "streetNumber" = null
            where
            "streetName" like '%ת.ד.%'
        `);

        // Cleanup any weird characters
        await queryRunner.query(`
            update
            location set
            "postOfficeBox" = (regexp_replace("postOfficeBox", '([^\\d])', '', 'g'))
            where
            "postOfficeBox" is not null;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // Would rather never have to run this, we lose data by doing this
        await queryRunner.query(`
            update location set
            "streetNumber" = "postOfficeBox",
            "postOfficeBox" = null,
            "streetName" = 'ת.ד.',
            where
            "postOfficeBox" is not null
        `);
    }
}
