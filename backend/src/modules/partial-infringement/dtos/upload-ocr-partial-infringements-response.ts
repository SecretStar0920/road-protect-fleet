import { PartialInfringement } from '@entities';


export class UploadOcrPartialInfringementsResponse {

    constructor(
        public valid: PartialInfringement[],
        public invalid: PartialInfringement[]
    ) {}

}
