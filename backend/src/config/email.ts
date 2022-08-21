export class SMTPMailer {
    host: string;
    port: number;
    secure?: boolean;
    auth: {
        user: string;
        pass: string;
    };
    fromAddress: string;
    subjectPrefix: string;
}

export const email: {
    resources: {
        partialsDirectory: string;
        layoutsDirectory: string;
        emailsDirectory: string;
    };
    mailers: { [env: string]: SMTPMailer };
    supportEmail: string;
    redirectionEmail: string;
    debugEmail: string;
} = {
    supportEmail: 'support@roadprotect.co.il',
    debugEmail: 'salman@roadprotect.co.il',
    redirectionEmail: 'muni@roadprotect.co.il',
    resources: {
        partialsDirectory: '/app/emails/partials',
        layoutsDirectory: '/app/emails/layouts',
        emailsDirectory: '/app/emails/emails',
    },
    mailers: {
        dev: {
            host: 'smtp',
            port: 1025,
            auth: {
                user: 'test@test.com',
                pass: 'pass',
            },
            fromAddress: process.env.SMTP_FROM || 'info@roadprotect.co.il',
            subjectPrefix: 'Road Protect (DEV) | ',
        },
        staging: {
            host: 'smtp',
            port: 1025,
            auth: {
                user: 'test@test.com',
                pass: 'pass',
            },
            fromAddress: process.env.SMTP_FROM || 'info@roadprotect.co.il',
            subjectPrefix: 'Road Protect (STAGING) | ',
        },
        production: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
            fromAddress: process.env.SMTP_FROM || 'info@roadprotect.co.il',
            subjectPrefix: 'Road Protect | ',
        },
    },
};
