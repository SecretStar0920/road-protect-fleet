import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
    production: true,
    backendUrl: '',
    apiVersion: 'api/v1',
    loggingLevel: NgxLoggerLevel.INFO,
    currency: {
        unit: 'Israeli Shekel',
        symbol: '₪​',
        code: 'ILS',
    },
    google: {
        maps: {
            key: 'AIzaSyAmptwW-qVw8-TqNozFsnOWboKgYf-Mq-w',
        },
        recaptcha: {
            siteKey: '6LcgZjsaAAAAAAHs531yhtyX0sq-7mylWdGGwkm8',
        },
    },
};
