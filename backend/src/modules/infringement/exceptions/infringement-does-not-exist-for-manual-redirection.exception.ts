export class InfringementDoesNotExistForManualRedirectionException extends Error {
    constructor(public noticeNumber: string, public issuer: string) {
        super(`Could not find the infringement ${noticeNumber} from issuer ${issuer}`);
    }
}
