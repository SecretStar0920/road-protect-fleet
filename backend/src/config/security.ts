export const security = {
    userJwt: {
        secret: process.env.JWT_SECRET,
        expiry: process.env.JWT_EXPIRY || '31 days',
    },
    clientJwt: {
        secret: process.env.JWT_SECRET,
        expiry: '10 years',
    },
    bcrypt: {
        rounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    },
    aes: {
        key: process.env.ENC_KEY,
    },
    maxLoginAttempts: Number(process.env.MAX_LOGIN_ATTEMPTS || 10),
};
