// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
    production: false,
    backendUrl: '',
    apiVersion: 'api/v1',
    loggingLevel: NgxLoggerLevel.DEBUG,
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
            siteKey: '6LfsxzUaAAAAACq9LqE6_LJHAhwVeO-8_ejxql39',
        },
    },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
