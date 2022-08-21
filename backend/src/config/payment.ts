import { requiredConfig } from './required-config.function';

export interface ICreditGuardCredentials {
    url: string;
    user: string;
    password: string;
    tid: string;
    mid: string;
}

export interface ICreditCard {
    number: string;
    exp: string;
    cvv: string;
    holder: string;
    holderId: string;
}

export const payment: {
    credentials: { [key: string]: ICreditGuardCredentials };
    rpCreditCard: { data: string; iv: string };
    paymentVerificationHours: number;
} = {
    credentials: {
        atgCreditGuard: {
            url: process.env.ATG_CREDIT_GUARD_URL,
            user: process.env.ATG_CREDIT_GUARD_USER,
            password: process.env.ATG_CREDIT_GUARD_PASSWORD,
            tid: process.env.ATG_CREDIT_GUARD_TID,
            mid: process.env.ATG_CREDIT_GUARD_MID,
        },
        rpCreditGuard: {
            url: process.env.RP_CREDIT_GUARD_URL,
            user: process.env.RP_CREDIT_GUARD_USER,
            password: process.env.RP_CREDIT_GUARD_PASSWORD,
            tid: process.env.RP_CREDIT_GUARD_TID,
            mid: process.env.RP_CREDIT_GUARD_MID,
        },
    },
    rpCreditCard: {
        data: process.env.RP_CC_DATA || requiredConfig('RP_CC_DATA'),
        iv: process.env.RP_CC_IV || requiredConfig('RP_CC_IV'),
    },
    paymentVerificationHours: 48, // How many hours before the current time that an infringement needs to be verified before a payment is made.
};
