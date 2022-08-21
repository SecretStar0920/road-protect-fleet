import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class GeneralCrawlerSingleInfringementRequestDto {
    @IsString()
    @Expose()
    reportNumber: string;

    @IsString()
    @Expose()
    carNumber: string;

    @IsOptional()
    @IsString()
    userBrn?: string;

    @IsOptional()
    @IsString()
    userName?: string;

    @IsOptional()
    @IsString()
    currentBrn?: string;

    @IsOptional()
    @IsString()
    ownerBrn?: string;

    @IsOptional()
    @IsString()
    ownerName?: string;

    get queryString(): string {
        return `?reportNumber=${this.reportNumber}&carNumber=${this.carNumber}&currentBrn=${this.currentBrn}&userBrn=${
            this.userBrn
        }&userName=${encodeURI(this.userName?.slice(0, 20))}&ownerBrn=${this.ownerBrn}&ownerName=${encodeURI(
            this.ownerName?.slice(0, 20),
        )}`;
    }
}

export class GeneralCrawlerMultipleInfringementRequestDto extends GeneralCrawlerSingleInfringementRequestDto {
    @IsString()
    @Expose()
    idNumber: string;

    get queryString(): string {
        return super.queryString + `&idNumber=${this.idNumber}`;
    }
}
