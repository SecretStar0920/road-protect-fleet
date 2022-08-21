import { Config } from '@config/config';
import { Logger } from '@logger';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { EmailContext } from '../interfaces/email.interface';
import * as express_handlebars from 'express-handlebars';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { Attachment } from 'nodemailer/lib/mailer';
import { SMTPMailer } from '@config/email';
import * as hbs from 'nodemailer-express-handlebars';
import * as nodemailerHtmlToText from 'nodemailer-html-to-text';
import * as juice from 'nodemailer-juice';
import { EmailLog } from '@entities';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';

interface Email {
    template: EmailTemplate | NoLogEmailTemplate;
    from?: string;
    to: string;
    subject: string;
    context?: EmailContext;
    attachments?: Attachment[];
    lang?: 'en' | 'he';
    cc?: string[];
    bcc?: string[];
}

@Injectable()
export class EmailService implements OnModuleInit {
    private transport: Mail;
    private mailer: SMTPMailer;

    constructor(private logger: Logger) {}

    private configureTransport() {
        // Select correct mailer and configuration based on current environment
        if (Config.get.isDevelopment() || Config.get.isTesting()) {
            this.mailer = Config.get.email.mailers.dev;
            this.logger.debug({
                message: 'Configured development email transport with Ethereal Email',
                detail: null,
                fn: this.configureTransport.name,
            });
        } else if (Config.get.isStaging()) {
            this.mailer = Config.get.email.mailers.dev;
            this.logger.debug({
                message: 'Configured staging email transport with Ethereal Email',
                detail: null,
                fn: this.configureTransport.name,
            });
        } else if (Config.get.isProduction()) {
            this.mailer = Config.get.email.mailers.production;
            this.logger.debug({
                message: 'Configured production email transport with Postmark',
                detail: null,
                fn: this.configureTransport.name,
            });
        } else {
            this.mailer = Config.get.email.mailers.dev;
            this.logger.warn({
                message: 'Unknown environment, configured dev email transport',
                detail: null,
                fn: this.configureTransport.name,
            });
        }

        // Standard html emailer
        this.transport = createTransport(this.mailer);
        this.transport.use(
            'compile',
            hbs({
                viewEngine: express_handlebars.create({
                    extname: 'hbs',
                    helpers: {},
                    partialsDir: Config.get.email.resources.partialsDirectory,
                    layoutsDir: Config.get.email.resources.layoutsDirectory,
                    defaultLayout: 'default.hbs',
                }),
                viewPath: Config.get.email.resources.emailsDirectory,
                extName: '.hbs',
            }),
        );
        this.transport.use('compile', nodemailerHtmlToText.htmlToText());
        this.transport.use('compile', juice());
    }

    async sendEmail(details: Email) {
        const attachments = details.attachments === undefined ? null : details.attachments;
        const lang = details.lang || 'en';
        const context = details.context;
        context.lang = lang;
        const mail: Email = {
            from: details.from ? details.from : this.mailer.fromAddress,
            to: details.to,
            cc: details.cc || [],
            bcc: ['virtual@roadprotect.co.il'],
            subject: this.mailer.subjectPrefix + details.subject,
            template: details.template,
            context: details.context,
            attachments,
        };

        // Remove me
        try {
            const sendResult = await this.transport.sendMail(mail);
            this.logger.debug({
                message: `Successfully sent email [${details.template}] to [${details.to}]`,
                detail: '',
                fn: this.sendEmail.name,
            });
            await this.logEmailSend(mail, true);
            return sendResult;
        } catch (e) {
            this.logger.error({
                message: `Failed to send email [${details.template}] to [${details.to}]`,
                detail: e,
                fn: this.sendEmail.name,
            });
            await this.logEmailSend(mail, false, e);
            throw e;
        }
    }

    async logEmailSend(mail: Email, success: boolean, error?: any) {
        const templateName = Object.keys(EmailTemplate).find(key => EmailTemplate[key] === mail.template);
        const templateValue = EmailTemplate[templateName]
        if (templateValue === undefined) {
            return
        }

        const data: Partial<EmailLog> = {
            template: templateValue,
            to: mail.to,
            cc: mail.cc,
            bcc: mail.bcc,
            success,
            context: mail.context,
            attachments: !!mail.attachments,
            details: error,
        };

        try {
            await EmailLog.create(data).save();
            this.logger.debug({
                message: 'Created an EmailLog',
                fn: this.logEmailSend.name,
            });
        } catch (e) {
            this.logger.error({
                message: 'Failed to create an EmailLog',
                detail: e,
                fn: this.logEmailSend.name,
            });
            databaseExceptionHelper(e, {}, 'Failed to create email log, please contact the developers.');
        }
    }

    onModuleInit() {
        this.configureTransport();
    }
}

export enum EmailTemplate {
    AccountInvitation = 'account-invitation',
    AccountUserRoleChange = 'account-user-role-change',
    AccountUserRemoval = 'account-user-removal',
    AccountReport = 'account-report',
    UserCreation = 'user-creation',
    ForgotPassword = 'forgot-password',
    VehicleAddition = 'vehicle-addition-notification',
    VehicleLeaseNotification = 'vehicle-lease-notification',
    InfringementReports = 'infringement-reports',
    RequestInformationFromIssuer = 'request-information',
    MunicipalRedirection = 'municipal-redirection',
    FailedPaymentUserNotification = 'failed-payment-user-notification',
    FailedPaymentAdminNotification = 'failed-payment-admin-notification',
    ClusterNodeChange = 'cluster-node-change',
}

export enum NoLogEmailTemplate {
    AccountRelationsSpreadsheetGenerateResult = 'account-relations-spreadsheet-generate-result',
}
