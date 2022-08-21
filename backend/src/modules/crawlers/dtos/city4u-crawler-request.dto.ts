import { GeneralCrawlerSingleInfringementRequestDto } from '@modules/crawlers/dtos/general-crawler-request.dto';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class City4uSingleCrawlerRequestDto extends GeneralCrawlerSingleInfringementRequestDto {
    @IsString()
    @Expose()
    rashut: string;

    get queryString(): string {
        return super.queryString + `&rashut=${this.rashut}`;
    }
}
