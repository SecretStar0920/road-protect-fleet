import * as fs from 'fs-extra';
import * as path from 'path';

export const certificates = {
    atg: fs.readFileSync(path.join(__dirname, '..', '..', 'certificates', 'atg-cert.pem')),
};
