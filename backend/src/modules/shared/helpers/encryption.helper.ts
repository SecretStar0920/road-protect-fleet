import * as crypto from 'crypto';
import { Config } from '@config/config';
import { IEncrypted } from '@modules/shared/helpers/encrypted.interface';
import { Logger } from '@logger';

export class EncryptionHelper {
    static algorithm = 'aes-256-cbc';
    static key = Buffer.from(Config.get.security.aes.key, 'hex');

    static encryptJSON<T = any>(unencryptedData: T) {
        return this.encrypt<T>(JSON.stringify(unencryptedData));
    }

    static decryptJSON<T = any>(encryptedData: IEncrypted<T>) {
        if (!encryptedData) {
            return encryptedData;
        }
        try {
            return JSON.parse(this.decrypt<T>(encryptedData));
        } catch (e) {
            // Sometimes, we will upload data from different environments to
            // staging and if that happens, we don't want everything to fail
            // because the decryption key is incorrect.
            if (Config.get.isProduction()) {
                throw e;
            }
            Logger.instance.error({
                fn: this.decrypt.name,
                message: `Failed to decrypt the data but will not throw an error since we are not in prod. Error: ${e.message}`,
            });
            return {} as T;
        }
    }

    static encrypt<T = any>(unencryptedData: string | Buffer | NodeJS.TypedArray | DataView): IEncrypted<T> {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key), iv);
        let encrypted = cipher.update(unencryptedData);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: iv.toString('hex'), data: encrypted.toString('hex') };
    }

    static decrypt<T = any>(encryptedData: IEncrypted<T>) {
        if (!encryptedData.iv) {
            return JSON.stringify(null);
        }
        const iv = Buffer.from(encryptedData.iv, 'hex');
        const encryptedText = Buffer.from(encryptedData.data, 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}
