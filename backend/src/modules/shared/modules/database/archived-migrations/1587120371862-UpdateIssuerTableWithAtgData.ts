import { MigrationInterface, QueryRunner } from 'typeorm';

// TODO: insert queries here for the update
export class UpdateIssuerTableWithAtgData1587120371862 implements MigrationInterface {
    name = 'UpdateIssuerTableWithAtgData1587120371862';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"371000","isPCI":"0","isSignedUpWithRoadProtect":"0"}' where "name" = 'אשקלון'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"390000","isPCI":"1","isSignedUpWithRoadProtect":"0"}' where "name" = 'באר שבע'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"261000","isPCI":"0","isSignedUpWithRoadProtect":"1"}' where "name" = 'בני ברק'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"693000","isPCI":"0","isSignedUpWithRoadProtect":"0"}' where "name" = 'זכרון יעקב'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"266000","isPCI":"1","isSignedUpWithRoadProtect":"0"}' where "name" = 'חולון'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"140000","isPCI":"1","isSignedUpWithRoadProtect":"0"}' where "name" = 'חיפה'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"367000","isPCI":"1","isSignedUpWithRoadProtect":"1"}' where "name" = 'טבריה'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"526600","isPCI":"0","isSignedUpWithRoadProtect":"0"}' where "name" = 'יבנה'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"602400","isPCI":"0","isSignedUpWithRoadProtect":"0"}' where "name" = 'יקנעם עילית'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"508740","isPCI":"1","isSignedUpWithRoadProtect":"0"}' where "name" = 'מגדל העמק'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"510630","isPCI":"1","isSignedUpWithRoadProtect":"0"}' where "name" = 'מעלות-תרשיחא'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"291000","isPCI":"0","isSignedUpWithRoadProtect":"1"}' where "name" = 'נהריה'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"368000","isPCI":"0","isSignedUpWithRoadProtect":"0"}' where "name" = 'קריית אתא'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"423000","isPCI":"1","isSignedUpWithRoadProtect":"0"}' where "name" = 'קריית טבעון'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"382000","isPCI":"1","isSignedUpWithRoadProtect":"0"}' where "name" = 'קריית מוצקין'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"283000","isPCI":"0","isSignedUpWithRoadProtect":"0"}' where "name" = 'ראשון לציון'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"426500","isPCI":"0","isSignedUpWithRoadProtect":"0"}' where "name" = 'רמת השרון'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"835700","isPCI":"1","isSignedUpWithRoadProtect":"0"}' where "name" = 'אריאל'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"813510","isPCI":"0","isSignedUpWithRoadProtect":"0"}' where "name" = 'מודיעין-מכבים-רעות'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"927100","isPCI":"1","isSignedUpWithRoadProtect":"0"}' where "name" = 'אום אל-פחם'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"510200","isPCI":"1","isSignedUpWithRoadProtect":"1"}' where "name" = 'אור עקיבא'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"880020","isPCI":"0","isSignedUpWithRoadProtect":"0"}' where "name" = 'מגדל תפן'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"594000","isPCI":"1","isSignedUpWithRoadProtect":"1"}' where "name" = 'יהוד מונוסון'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"810220","isPCI":"1","isSignedUpWithRoadProtect":"0"}' where "name" = 'רמת ישי'`,
        );
        await queryRunner.query(
            `UPDATE "issuer" set "integrationDetails" = "integrationDetails" || '{"type":"ATG","code":"22060","isPCI":"0","isSignedUpWithRoadProtect":"0"}' where "name" = 'עמק הירדן'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`UPDATE "issuer" set "integrationDetails" = '{}'`);
    }
}
