import { GeneralCrawlerMultipleInfringementRequestDto } from '@modules/crawlers/dtos/general-crawler-request.dto';
import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class TelavivCrawlerMultipleInfringementRequestDto extends GeneralCrawlerMultipleInfringementRequestDto {
    @IsBoolean()
    @Expose()
    firstPage: boolean;

    get queryString(): string {
        if (this.firstPage) {
            return super.queryString + `&firstPage=true`;
        }
        return '';
    }
}
