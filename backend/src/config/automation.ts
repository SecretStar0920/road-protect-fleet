export const automation = {
    /**
     * This is the default contact number that is used when an account does not
     * have one specified.
     */
    defaultContactNumber: process.env.AUTOMATION_DEFAULT_CONTACT_NUMBER || '0544757841',
    recipient: 23,
    sender: 23,
    userId: '515053726',
    internalIP: process.env.AUTOMATION_INTERNAL_IP || '192.168.110.6',
    /**
     * We are not concerned about the password being available as only requests from our production server will be allowed through
     */
    password: 'RQc5!7bBae',
    version: '1.0',
};
