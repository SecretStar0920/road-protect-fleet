import { IsDefined, IsInt, IsNumber, IsString } from 'class-validator';

export class VerifyBatchInfringementsDto {
    @IsNumber({}, { each: true })
    infringementIds: number[];
}

export class VerifyBatchInfringementsByNoticeNumberDto {
    @IsInt({ each: true })
    @IsDefined()
    noticeNumbers: number[];
}
