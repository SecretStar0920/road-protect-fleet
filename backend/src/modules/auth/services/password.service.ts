import { Injectable } from '@nestjs/common';
import { Config } from '@config/config';
import * as crypto from 'crypto';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
    constructor() {}

    public async generatePassword(password: string = v4()): Promise<{ raw: string; hashed: string; bcrypted: string }> {
        const raw = password;
        const hashed = crypto.createHash('SHA512').update(raw).digest('hex');
        const bcrypted = await this.generateBcryptHash(hashed);
        return {
            raw,
            hashed,
            bcrypted,
        };
    }

    public async generateBcryptHash(hashed: string) {
        const bcrypted = await bcrypt.hash(hashed, Config.get.security.bcrypt.rounds);
        return bcrypted;
    }
}
