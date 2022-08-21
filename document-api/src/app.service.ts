import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    async health(): Promise<boolean> {
        return true;
    }
}
