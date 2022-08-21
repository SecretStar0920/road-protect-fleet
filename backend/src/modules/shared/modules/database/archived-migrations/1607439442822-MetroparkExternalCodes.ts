import { MigrationInterface, QueryRunner } from 'typeorm';
const nameCodeMapping = {
    'נוף הגליל': '66',
    נתניה: '40',
    לוד: '9',
    'כפר יונה': '61',
    'גבעת שמואל': '5',
    'כפר שמריהו': '31',
    'נס ציונה': '19',
    נצרת: '22',
    'ראש העין': '46',
    'בת ים': '8',
    רחובות: '3',
    'בנימינה-גבעת עדה': '45',
    'כפר סבא': '10',
    'באר טוביה': '96',
    'קרית ים': '53',
    'זכרון יעקב': '47',
    עכו: '41',
    צפת: '7',
    "בני עי'ש": '49',
    נשר: '43',
    'קרית גת': '72',
    קצרין: '38',
    רעננה: '12',
    'אור יהודה': '79',
    אילת: '4',
    אפרת: '85',
    אשדוד: '30',
    'באר יעקב': '56',
    'חבל מודיעין': '58',
    'חצור הגלילית': '25',
    כרמיאל: '20',
    'קרית מלאכי': '26',
    'קרית שמונה': '71',
    רמלה: '39',
    'פתח תקווה': '13',
    אופקים: '36',
    'נוף הגליל - נצרת עילית': '66',
    'ת חבל מודיעין': '58',
    'קרית עקרון': '52',
};

export class MetroparkExternalCodes1607439442822 implements MigrationInterface {
    name = 'MetroparkExternalCodes1607439442822';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const metroparkIssuers = await queryRunner.query(`SELECT * FROM issuer WHERE "integrationDetails"->>'type' = 'Metropark'`);
        for (const issuer of metroparkIssuers) {
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
