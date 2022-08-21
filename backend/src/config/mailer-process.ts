export const mailerProcess = {
   ccAddress: ['shanig@tashtit.co.il','danield@tashtit.co.il','ore@roadprotect.co.il'],
    /**
     * The maximum number of days before we kick out an infringement from the
     * report.
     */
    minimumVerificationDays: Number(process.env.MAILER_PROCESS_MINIMUM_VERIFICATION_DAYS || 5),
};
