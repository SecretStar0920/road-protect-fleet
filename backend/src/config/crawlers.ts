import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

const defaultCrawlerHost = process.env.CRAWLER_API_URL || 'http://63.250.61.47:3000'

export class Crawler {
    @IsString()
    host: string;

    @IsString()
    @IsOptional()
    issuerCode?: string;

    @IsString()
    @Transform((value, obj) => `${obj.host}${value}`)
    finesEndpoint: string;

    @IsString()
    @Transform((value, obj) => `${obj.host}${value}`)
    preparePaymentEndpoint: string;

    @IsString()
    @IsOptional()
    @Transform((value, obj) => `${obj.host}${value}`)
    transferFineEndpoint?: string;

    @IsString()
    clientName: string;
}

type Crawlers = {
    jerusalem: Crawler;
    telaviv: Crawler;
    mileon: Crawler;
    metropark: Crawler;
    kfarSaba: Crawler;
    police: Crawler;
    shohar: Crawler;
    city4u: Crawler;
};

export const crawlers: Crawlers = {
    jerusalem: {
        host: defaultCrawlerHost,
        issuerCode: '3000',
        finesEndpoint: `/jerusalem/fines`,
        preparePaymentEndpoint: `/jerusalem/prepare_payment`,
        transferFineEndpoint: `/jerusalem/transfer_fine`,
        clientName: 'jerusalem-crawler',
    },
    telaviv: {
        host: defaultCrawlerHost,
        issuerCode: '5000',
        finesEndpoint: `/telaviv/fines`,
        transferFineEndpoint: `/telaviv/transfer_fine`,
        preparePaymentEndpoint: `/telaviv/prepare_payment`,
        clientName: 'telaviv-crawler',
    },
    mileon: {
        host: defaultCrawlerHost,
        finesEndpoint: `/mileon/fines`,
        preparePaymentEndpoint: `/mileon/getPaymentLink`,
        clientName: 'mileon-crawler',
        transferFineEndpoint: `/mileon/transfer_fine`,
    },
    city4u: {
        host: defaultCrawlerHost,
        finesEndpoint: `/city4u/fines`,
        preparePaymentEndpoint: `/city4u/getPaymentLink`,
        clientName: 'city4u-crawler',
        transferFineEndpoint: `/city4u/transfer_fine`,
    },
    metropark: {
        host: defaultCrawlerHost,
        finesEndpoint: `/metropark/fines`,
        preparePaymentEndpoint: `/metropark/getPaymentLink`,
        clientName: 'metropark-crawler',
        transferFineEndpoint: `/metropark/transfer_fine`,
    },
    kfarSaba: {
        host: defaultCrawlerHost,
        finesEndpoint: `/kfarSaba/fines`,
        preparePaymentEndpoint: `/kfarSaba/getPaymentLink`,
        clientName: 'kfarSaba-crawler',
        transferFineEndpoint: `/kfarSaba/transfer_fine`,
    },
    police: {
        host: defaultCrawlerHost,
        issuerCode: '9991',
        finesEndpoint: `/police/fines`,
        preparePaymentEndpoint: `/police/getPaymentLink`,
        transferFineEndpoint: `/police/transfer_fine`,
        clientName: 'police-crawler',
    },
    shohar: {
        host: defaultCrawlerHost,
        finesEndpoint: `/shohar/fines`,
        preparePaymentEndpoint: `/shohar/getPaymentLink`,
        clientName: 'shohar-crawler',
    },
};


export const crawlerConfig = {
    defaultTimeout: 380 * 1000, // 5 minutes
    policeTimeout: 300 * 1000, // 5 minutes
    telavivTimeout: 900 * 1000, // 15 minutes
    schedulersEnabled: () => {
        return process.env.CRAWLER_SCHEDULER_ENABLED === '1';
    },
};
