import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class PoliceCrawlerSingleInfringementRequestDto {
    @IsString()
    @Expose()
    reportNumber: string;

    @IsOptional()
    @IsString()
    userBrn?: string;

    @IsOptional()
    @IsString()
    userName?: string;

    @IsOptional()
    @IsString()
    ownerBrn?: string;

    @IsOptional()
    @IsString()
    ownerName?: string;

    @IsOptional()
    @IsString()
    carNumber?: string;

    get queryString(): string {
        return `?reportNumber=${encodeURI(this.reportNumber)}&userBrn=${this.userBrn}&carNumber=${this.carNumber}&userName=${encodeURI(
            this.userName,
        )}&ownerBrn=${this.ownerBrn}&ownerName=${encodeURI(this.ownerName)}`;
    }
}

export class PoliceCrawlerMultipleInfringementRequestDto extends PoliceCrawlerSingleInfringementRequestDto {
    @IsString()
    @Expose()
    idNumber: string;

    get queryString(): string {
        return super.queryString + `&idNumber=${this.idNumber}`;
    }
}
