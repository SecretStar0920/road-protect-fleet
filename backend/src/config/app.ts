export const app = {
    url: process.env.APP_URL || 'http://localhost:3000',
    defaultTimezone: process.env.TIMEZONE || 'Asia/Tel_Aviv',
    title: process.env.APP_TITLE || 'Road Protect',
    description: process.env.APP_DESCRIPTION || 'Road Protect',
    version: process.env.APP_VERSION || '0.0.0',
    timezone: process.env.TIMEZONE || 'Asia/Tel_Aviv',
    defaultCountry: process.env.COUNTRY || 'Israel',
    /**
     * This is the minimum date for incoming data (infringements, contracts, etc)
     * that would be accepted. Dates before this would be set to null. It's mainly
     * to kick out any bad data on dtos
     */
    minimumDate: process.env.MINIMUM_DATE || '2000-01-01',
    minimumYear: Number(process.env.MINIMUM_YEAR || 2000),
};
