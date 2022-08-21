import { MigrationInterface, QueryRunner } from 'typeorm';

const nameCodeMapping = {
    'קדימה-צורן': '920025',
    'טירת כרמל': '920056',
    חדרה: '265000',
    'הוד השרון': '9700',
    'בית דגן': '920016',
    'בית שמש': '526100',
    'גני תקווה': '920010',
    'מעלה אדומים': '836160',
    'רמת גן': '186111',
    שדרות: '920057',
    שוהם: '920038',
    גבעתיים: '920044',
    'פרדס חנה-כרכור': '920035',
    'עמק חפר': '920036',
    'כפר קאסם': '920061',
    הרצליה: '920039',
    'גן יבנה': '920022',
    אזור: '920013',
    ערד: '920021',
    'מזכרת בתיה': '920037',
    'מועצה איזורית דרום השרון': '920058',
    'גן רוה': '920052',
    'מועצה אזורית חבל יבנה': '920045',
    'מועצה אזורית גוש עציון': '920041',
    לקיה: '920020',
    חוסנייה: '920031',
    ידידה: '920011',
    כרמל: '920023',
    'פקיעין חדשה': '920035',
    עמנואל: '920036',
    'חוף השרון': '920031',
    'גן רווה': '920052',
    'חבל יבנה': '920045',
    'גוש עציון': '920041',
    אורנית: '920043',
    'קרני שומרון': '920009',
    'כוכב יאיר': '920051',
    'גליל תחתון': '920063',
    'דרום השרון': '920058',
    תמר: '920020',
};
export class MileonExternalCodes1607438219256 implements MigrationInterface {
    name = 'MileonExternalCodes1607438219256';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const mileonIssuers = await queryRunner.query(`SELECT * FROM issuer WHERE "integrationDetails"->>'type' = 'Mileon'`);
        for (const issuer of mileonIssuers) {
            const externalCode = nameCodeMapping[issuer.name];
            if (externalCode) {
                const integrationDetails = {
                    ...issuer.integrationDetails,
                    code: externalCode,
                };

                await queryRunner.query(
                    `UPDATE issuer SET "integrationDetails" = '${JSON.stringify(integrationDetails)}' WHERE "issuerId"=${issuer.issuerId}`,
                );
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
